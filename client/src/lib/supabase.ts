// Direct Supabase API calls without the SDK
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey ? {
    from: (table: string) => ({
        select: (columns = '*') => ({
            order: async (column: string, options?: { ascending?: boolean }) => {
                try {
                    const orderParam = options?.ascending ? `${column}.asc` : `${column}.desc`;
                    const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${columns}&order=${orderParam}`, {
                        headers: {
                            'apikey': supabaseKey,
                            'Authorization': `Bearer ${supabaseKey}`,
                        },
                    });
                    const data = await response.json();
                    return { data, error: null };
                } catch (error) {
                    return { data: null, error };
                }
            },
        }),
        insert: async (values: any) => {
            try {
                const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
                    method: 'POST',
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal',
                    },
                    body: JSON.stringify(values),
                });
                if (!response.ok) {
                    const error = await response.text();
                    return { data: null, error: new Error(error) };
                }
                return { data: values, error: null };
            } catch (error) {
                return { data: null, error };
            }
        },
        update: (values: any) => ({
            eq: async (column: string, value: any) => {
                try {
                    const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}`, {
                        method: 'PATCH',
                        headers: {
                            'apikey': supabaseKey,
                            'Authorization': `Bearer ${supabaseKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(values),
                    });
                    if (!response.ok) {
                        const error = await response.text();
                        return { data: null, error: new Error(error) };
                    }
                    return { data: values, error: null };
                } catch (error) {
                    return { data: null, error };
                }
            },
        }),
    }),
} : null;

export const isSupabaseConfigured = () => {
    return !!(supabaseUrl && supabaseKey && supabase);
};
