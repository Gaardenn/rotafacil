import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)
const ACTIVE_GROUP_KEY = 'rotafacil_active_group'

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [groups, setGroups] = useState([])
    const [activeGroupId, setActiveGroupId] = useState(
        () => localStorage.getItem(ACTIVE_GROUP_KEY) || null
    )
    const [loading, setLoading] = useState(true)
    const [groupsLoaded, setGroupsLoaded] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session)
            setLoading(false)
        })

        const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession)
        })

        return () => listener.subscription.unsubscribe()
    }, [])

    useEffect(() => {
        if (!session) {
            setGroups([])
            setGroupsLoaded(false)
            return
        }
        loadGroups()
    }, [session])

    async function loadGroups() {
        const { data, error } = await supabase.from('groups').select('*').order('created_at')
        if (error) {
            console.error('Erro ao carregar grupos:', error.message)
            setGroupsLoaded(true)
            return
        }
        setGroups(data)
        setGroupsLoaded(true)
        setActiveGroupId((current) => {
            if (current && !data.some((g) => g.id === current)) {
                localStorage.removeItem(ACITVE_GROUP_KEY)
                return null
            }
            return current
        })
    }

    function selectGroup(groupId) {
        setActiveGroupId(groupId)
        localStorage.setItem(ACTIVE_GROUP_KEY, groupId)
    }

    async function signUp(email, password, fullName) {
        return supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        })
    }

    async function signIn(email, password) {
        return supabase.auth.signInWithPassword({ email, password })
    }

    async function signOut() {
        setActiveGroupId(null)
        localStorage.removeItem(ACTIVE_GROUP_KEY)
        return supabase.auth.signOut()
    }

    async function createGroup(name) {
        const { data, error } = await supabase.rpc('create_group', { group_name: name })
        if (!error) {
            await loadGroups()
            selectGroup(data.id)
        }
        return { data, error }
    }

    async function joinGroup(code) {
        const { data, error } = await supabase.rpc('join_group_by_code', { code })
        if (!error) {
            await loadGroups()
            selectGroup(data.id)
        }
        return { data, error }
    }

    async function leaveGroup(groupId) {
        const { error } = await supabase.rpc('leave_group', { gid: groupId })
        if (!error) {
            if (activeGroupId === groupId) {
                setActiveGroupId(null)
                localStorage.removeItem(ACTIVE_GROUP_KEY)
            }
            await loadGroups()
        }
        return { error }
    }

    const activeGroup = groups.find((g) => g.id === activeGroupId) || null

    return (
        <AuthContext.Provider
            value={{
                session,
                groups,
                groupsLoaded,
                activeGroup,
                loading,
                signUp,
                signIn,
                signOut,
                createGroup,
                joinGroup,
                leaveGroup,
                selectGroup,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}