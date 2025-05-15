import { supabase } from '@/lib/supabase';

export const fetchPositions = async () => {
    const { data, error } = await supabase
        .from('positions')
        .select('*');

    if(error){
        console.error('Error fetching positions:', error);
        return [];
    }

    return data;
}