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