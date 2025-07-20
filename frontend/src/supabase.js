export const supabaseUrl = 'https://pbkfyvhbwzirjootonzr.supabase.co'
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBia2Z5dmhid3ppcmpvb3RvbnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTEzODcsImV4cCI6MjA2NzQ4NzM4N30.gfXjrnyutFE25Fx0xZxsEewYEWpgW0320wuLrgEkGOc' 


export async function getUserInfo(supabaseClient, user_id) {

    let catalogs = [];
    let genres = [];

    let { data: catalogData, error: error } = await supabaseClient
        .from('user_catalogs')
        .select()
        .eq('user_id', user_id)

    if (error) {
        console.log(error);
    }

    catalogData.forEach(element => {
        catalogs.push(element["service"]);
    });


    const { data: genreData, error: error1 } = await supabaseClient
        .from('user_genres')
        .select()
        .eq('user_id', user_id)

    if (error1) {
        console.log(error);
    }

    genreData.forEach(element => {
        genres.push(element["genre"]);
    });

    return [catalogs, genres];
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

export async function saveInitialPreferences(userId, selectedCatalogs, selectedGenres, supabaseClient) {
    // Save catalogs
    const catalogInserts = selectedCatalogs.map(service => ({ user_id: userId, service }));
    const { error: catalogError } = await supabaseClient.from('user_catalogs').insert(catalogInserts);
    if (catalogError) throw catalogError;
  
    // Save genres
    const genreInserts = selectedGenres.map(genre => ({ user_id: userId, genre }));
    const { error: genreError } = await supabaseClient.from('user_genres').insert(genreInserts);
    if (genreError) throw genreError;
  }

  export async function updateUserPreferences(userId, selectedCatalogs, selectedGenres, supabaseClient) {
    // --- Update Catalogs ---
    // Step 1: Delete all existing catalog entries for this user.
    const { error: deleteCatalogError } = await supabaseClient
      .from('user_catalogs')
      .delete()
      .eq('user_id', userId);
    
    if (deleteCatalogError) throw deleteCatalogError;
  
    // Step 2: Insert the new set of catalog preferences.
    if (selectedCatalogs.length > 0) {
      const catalogInserts = selectedCatalogs.map(service => ({ user_id: userId, service }));
      const { error: insertCatalogError } = await supabaseClient.from('user_catalogs').insert(catalogInserts);
      if (insertCatalogError) throw insertCatalogError;
    }
  
    // --- Update Genres ---
    // Step 3: Delete all existing genre entries for this user.
    const { error: deleteGenreError } = await supabaseClient
      .from('user_genres')
      .delete()
      .eq('user_id', userId);
  
    if (deleteGenreError) throw deleteGenreError;
  
    // Step 4: Insert the new set of genre preferences.
    if (selectedGenres.length > 0) {
      const genreInserts = selectedGenres.map(genre => ({ user_id: userId, genre }));
      const { error: insertGenreError } = await supabaseClient.from('user_genres').insert(genreInserts);
      if (insertGenreError) throw insertGenreError;
    }
  }

export async function addShowToWatchlist(supabaseClient, userId, show) {
    if (!supabaseClient || !userId || !show) {
      console.error('Missing required data to add to watchlist.');
      return { data: null, error: new Error('Missing user or show data.') };
    }
  
    const showData = {
      user_id: userId,          
      id_imdb: show.imdbId,     
      title: show.title,    
    };
  
    const { data, error } = await supabaseClient
      .from('user_watchlist')
      .insert([showData])     
  
    if (error) {
      if (error.message.includes('duplicate key value violates unique constraint')) {
        console.log(`${show.title} is already in the watchlist.`);
        return { data: null, error: { message: 'already_exists' } };
      }
      console.error('Error adding to watchlist:', error.message);
    }
  
    return { data, error };
  }
  

// export async function saveUserCatalogs(userId, selectedCatalogs) {
//     if (!userId || !Array.isArray(selectedCatalogs)) {
//       throw new Error('Invalid userId or selectedCatalogs');
//     }
  
//     const inserts = selectedCatalogs.map(service => ({
//       user_id: userId,
//       service
//     }));
  
//     const { data, error } = await supabase
//       .from('user_catalogs')
//       .insert(inserts);
  
//     if (error) {
//       console.error('Insert error:', error);
//     }
  
//     return { data, error };
//   }
  