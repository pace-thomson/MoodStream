export const supabaseUrl = 'https://pbkfyvhbwzirjootonzr.supabase.co'
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBia2Z5dmhid3ppcmpvb3RvbnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTEzODcsImV4cCI6MjA2NzQ4NzM4N30.gfXjrnyutFE25Fx0xZxsEewYEWpgW0320wuLrgEkGOc' 


export async function getUserInfo(supabaseClient, user_id) {

    let userInfo = {
        user_id: user_id,
        catalogs: [],
        genres: []
    }

    let { data: catalogData, error: error } = await supabaseClient
        .from('user_catalogs')
        .select()
        .eq('user_id', user_id)

    if (error) {
        console.log(error);
    }

    catalogData.forEach(element => {
        userInfo.catalogs.push(element["service"]);
    });


    const { data: genreData, error: error1 } = await supabaseClient
        .from('user_genres')
        .select()
        .eq('user_id', user_id)

    if (error1) {
        console.log(error);
    }

    genreData.forEach(element => {
        userInfo.genres.push(element["genre"]);
    });

    console.log("userinfo", userInfo);

    return userInfo;
}

export async function getUserWatchlist(supabaseClient, user_id) {
    const { data, error } = await supabaseClient
      .from('user_watchlist')
      .select('id_imdb, title, year, poster, created_at, description, genres')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error('Watchlist fetch error:', error.message);
      return [];
    }
  
    return data;
}
  
export async function getUserMoodHistory(supabaseClient, user_id) {
    const { data, error } = await supabaseClient
      .from('user_history')
      .select('id, mood, transcript, created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error('Mood history fetch error:', error.message);
      return [];
    }
  
    return data;
}

export async function logout(supabaseClient) {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error('Logout failed:', error.message);
    }
}
  