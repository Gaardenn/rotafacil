import { supabase } from './supabaseClient'

export async function fetchPendingTasks(groupId) {
    return supabase
        .from('tasks')
        .select('*')
        .eq('group_id', groupId)
        .eq('completed', false)
        .order('created_at', { ascending: false })
}

export async function fetchCompletedTasks(groupId) {
    const { data: taskData, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('group_id', groupId)
        .eq('completed', true)
        .order('completed_at', { ascending: false })

    if (error) return { data: null, error }

    const userIds = [...new Set(taskData.map((t) => t.completed_by).filter(Boolean))]

    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds)
    
    const nameById = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.full_name]))

    const withNames = taskData.map((t) => ({
        ...t,
        completedByName: nameById[t.completed_by] ?? 'alguém',
    }))

    return { data: withNames, error: null }
}

export async function addTask({ title, groupId, userId }) {
    return supabase.from('tasks').insert({
        title,
        group_id: groupId,
        created_by: userId,
    })
}

export async function completeTask({ taskId, userId }) {
    return supabase
        .from('tasks')
        .update({
            completed: true,
            completed_by: userId,
            completed_at: new Date().toISOString(),
        })
        .eq('id', taskId)
}

export function subscribeToTaskChanges(groupId, onChange) {
    const channel = supabase
        .channel(`task-changes-${groupId}`)
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'tasks', filter: `group_id=eq.${groupId}` },
            onChange
        )
        .subscribe()
    
    return () => supabase.removeChannel(channel)
}