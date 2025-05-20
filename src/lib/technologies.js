import { supabase } from '@/lib/supabase';

export const fetchTechnologies = async () => {
    const { data, error } = await supabase
        .from('technologies')
        .select('*');

    if(error){
        console.error('Error fetching technologies:', error);
        return [];
    }

    return data;
}