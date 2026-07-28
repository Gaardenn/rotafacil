import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [group, setGroup] = useState(null)
    const [loading, setLoading] = useState(true)

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
            setGroup(null)
            return
        }
        loadGroup()
    }, [session])

    async function loadGroup() {
        const { data, error } = await supabase
            .from('groups')
            .select('*')
            .limit(1)
            .maybeSingle()
        
        if (!error) setGroup(data)
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
        return supabase.auth.signOut()
    }

    async function createGroup(name) {
        const { data, error } = await supabase.rpc('create_group', { group_name: name })
        if (!error) setGroup(data)
        return { data, error }
    }

    async function joinGroup(code) {
        const { data, error } = await supabase.rpc('join_group_by_code', { code })
        if (!error) setGroup(data)
        return { data, error }
    }

    return (
        <AuthContext.Provider
            value={{ session, group, loading, signUp, signIn, signOut, createGroup, joinGroup }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}