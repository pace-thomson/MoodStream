import { MovieNight } from './movieNight.mjs';
import { OpenAiHandler } from './openai.mjs';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = 3000;

const openAiHandler = new OpenAiHandler(process.env.OPEN_AI_API_KEY);
const availabilityApiHandler = new MovieNight(process.env.RAPID_API_KEY);


async function getShowsWithPrompt(data) {
    let aiResponse = await openAiHandler.getPreferencesFromTranscript(data.prompt);
    if (aiResponse == null) {
        return null;
    }
    const showList = await availabilityApiHandler.getShowsUsingPrompt(aiResponse, data.catalogs);
    return showList;
}

async function getShowsWithGenres(data) {
    const showList = await availabilityApiHandler.getShowsUsingGenres(data.genres, data.catalogs);
    return showList;
}


app.get('/alive', (req, res) => {
    res.send("i'm alive");
});

app.post('/recommend', express.json(), async (req, res) => {

    const data = req.body;
    console.log('data', data);

    let showsList;
    if (data.prompt) {
        showsList = await getShowsWithPrompt(data);
        if (showsList == null) {
            res.sendStatus(400);
        }
    } else if (data.genres) {
        showsList = await getShowsWithGenres(data);
    }

    console.log(showsList);
    
    res.status(200).json(showsList);
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}/`);
});


// async function tester() {
//     // const data = await availabilityApiHandler.client.showsApi.searchShowsByFiltersRaw({
//     //     title: "The Dark Knight",
//     //     country: 'us',
        
//     // });

//     const filter = {
//         country: "us",
//         catalogs: ['netflix', 'prime'],
//         showType: "movie",
//         orderBy: "popularity_alltime",
//     };

//     const idk = await availabilityApiHandler.client.showsApi.searchShowsByFilters(filter);

//     console.log(idk["shows"][0]);

//     // let biglist = [];

//     // let shows = idk.shows;

//     // shows.array.forEach(element => {
//     //     const newObj = {
//     //         thing: element.itemType,
//     //         showType: element.showType,
//     //         thing: element.id,
//     //         thing: element.imdbId,
//     //         thing: element.tmdbId,
//     //         thing: element.title,
//     //         thing: element.overview,
//     //         linke: element.ste,
//     //         catalog: []
//     //     }
//     // });

    
// }

// tester();



// ----------- Example Object returned ----------------

// let thing = {
//     itemType: 'show',
//     showType: 'movie',
//     id: '68',
//     imdbId: 'tt0468569',
//     tmdbId: 'movie/155',
//     title: 'The Dark Knight',
//     overview: 'With the help of Lieutenant Jim Gordon and new district attorney Harvey Dent, Batman sets out to destroy organised crime in Gotham City forever; but they soon find themselves prey to a rising criminal mastermind known as The Joker.',
//     releaseYear: 2008,
//     firstAirYear: undefined,
//     lastAirYear: undefined,
//     originalTitle: 'The Dark Knight',
//     genres: [
//         { id: 'action', name: 'Action' },
//         { id: 'crime', name: 'Crime' },
//         { id: 'drama', name: 'Drama' }
//     ],
//     directors: [ 'Christopher Nolan' ],
//     creators: undefined,
//     cast: [
//         'Christian Bale',
//         'Heath Ledger',
//         'Aaron Eckhart',
//         'Michael Caine',
//         'Maggie Gyllenhaal',
//         'Gary Oldman',
//         'Morgan Freeman'
//     ],
//     rating: 88,
//     seasonCount: undefined,
//     episodeCount: undefined,
//     runtime: 152,
//     imageSet: {
//         verticalPoster: {
//             w240: 'https://cdn.movieofthenight.com/show/68/poster/vertical/en/240.jpg?Expires=1769132483&Signature=Aos5dInQ9XPjLFpSb8mBU7t2atU7STMgTVyBI7oqXNOWwNBg1WtceamVWUMaKkBXTJ6pVqHaoD2XCbofw59K6nTyLuFRJXciONqgzi7g0bHxdGQZMZh1fEF70UW6YFhMO74Hv7409nt5txHyfamTsHjzuEn7iu9BWH4owwPXHgGsiFdsl-FRIDCLeOB~yxA~bVwKbzSDw-vqz1G~-OjfOsngY4PvEFne671hpmVUP9P4FuCItd6ROp68A0l4GPF1R0g4rGHjvYhvtracieiXTerj57zlxg-lTSG4MVfhVpijy2qb7MdYAZpkB7ulYmVV5Jset1fCePzH5GCnRCssYw__&Key-Pair-Id=KK4HN3OO4AT5R',
//             w360: 'https://cdn.movieofthenight.com/show/68/poster/vertical/en/360.jpg?Expires=1769132483&Signature=Qv-nvnOkmi-7DqI~H-yFIZTmkQzylqWLtWs9UdHqt-PO2ZlLHMDW5bz4MJloxBSBJrzAz62GCdrezVjNHIZxn9dD7xXuEW3S5l2F9IviJWeIjkqkLP4n3epdHKRCZF2m2tA9~zre9mFkcnAPI7NE2vLZ2o2nWrLxHFZxgWMgBLzemfts3eKiXav~Lhep3y8OtcaYhSJykaYg-HsSis3Q7ccHXRYswlk0ZuopuP5rZg1vX3URTrcgz0Vsxf~LuF~ylWccFapx4n845ml6MZsXqQme2cumHwk0TvsxOODaObs-pYYHWHDxcV61c4JTxDd0JKokvhbTHUABYr9ed0V-8A__&Key-Pair-Id=KK4HN3OO4AT5R',
//             w480: 'https://cdn.movieofthenight.com/show/68/poster/vertical/en/480.jpg?Expires=1769132483&Signature=NlXhTDuSKBzrQ7IyyeoqmLSdR8DdZGF655a~96kb4wQxEBJQ-CHbByYx9RYLee4r7Jf~50H-BJt-rCeGfZ95OxW~5GHQVQ2KKPib12gU4Ucl~Hv6PiOBVpOGNW25UF0L2leFovk3MuCzhRwYvlW~~4GTJNeTq7LxovxJ-Ay8yWGjOlUMFp2RttF~K-4xNlGJZ9bQuIBvQ4xw-AGy8ApRv2lRNy4oTVKnJXk9kPHLuaRFwP2B8d8WvIfZE3u-ucufd2bBQUpGI5PsU6CeNYFCdXsOaaWOlnL86im6Ykc9XIViWFpnaHG9stti04CjXwZJnNFlDd0Qrg20K0i4pIGOYw__&Key-Pair-Id=KK4HN3OO4AT5R',
//             w600: 'https://cdn.movieofthenight.com/show/68/poster/vertical/en/600.jpg?Expires=1769132483&Signature=UMlZL5K0YjtRkdgT5J-1K7bkPLAJ~3eIJDCg-350Ph6Ow43w8A1Q8-~xRBLkBzwtEE~9t8rEO9Ut1kO2tFfiswXHckIhY89WzUGSJ6v3Af38KX~COrRx7xzHyyZCZCs-8qQkYSkJxVK3ApzcVdjEHJqUULyYYNSgfzi38PPV6TG0dv9QiS4ZJ5sAR4bArWX6dIdTU7fgSyPgkpmqyq0lvjGlZoXPADXhZkd-OwMPFqfW4MSI-VCaXvzRjXsEeA18eKvMZokJ23N-JJ0Y~bcrMLAQBrGLiPCV9hfZqk1RP0d78xLFNEY-MyG6HI7tFGmkzOD3kfLrCHIOuYFpI24xRg__&Key-Pair-Id=KK4HN3OO4AT5R',
//             w720: 'https://cdn.movieofthenight.com/show/68/poster/vertical/en/720.jpg?Expires=1769132483&Signature=R6Cnst~SSAda-l8dN9Qw9WMqdi7ILkgNDn5E3kfIuzzyG16FZkH5buvD8O4YomXrKlL6WVIROw5HdJBIwQQ6q2RJ7fHF9HMYycX5L6ysj-lSrJ9vnb9OcPP8b~WBf-gmGSR5Q~lduluQVnCJELr1i8~hFx~Xks0XqSA9LdO5Fa4I2UIhiGPsvH~ajbB63LHH4g~euTWH4lzKpeAVk3-QfRZiLzFtcTtdLCvO6AqdLBLWHeSA3~wwQZi8yTbx0Eg8IGkDsm1ExGso~X6CXAdVk9YfMg-cNee-ZTjSysVWjpnqEXjwF1j3LyV6YCjp~lfdWbU6vqEx12nICzVcYX4qwQ__&Key-Pair-Id=KK4HN3OO4AT5R'
//         },
//         horizontalPoster: {
//             w360: 'https://cdn.movieofthenight.com/show/68/poster/horizontal/en/360.jpg?Expires=1769132487&Signature=NcM12cX1lelbXrWj4SMXWAadD1YMqRiSF-jTNwYIZdmZQZDb82FzGMW4MZwSr5YB-6N0zZkhHqIx9pwAbWYRbkBrDWxDIb5l-fwLU0YiFTvmQMoMSKyP3aUa827TlCjxeCTyShibROozV0PNjpf8sweHMX1KlBU2Pqp0HURlojRVxfoLvO5uH7DQezQsxoOtQJDhvaJ3fKe2GB4KHeYiIib9EH-~5BnUzPan08URTaUS0C48kCdqdug47dHmDdtgiW0lnxqE4oS33aCejDaovDrFgT5zckmvjJQEYaFHSqDr36RQupVcg8~nDtowwTkPMWkp1JOeFp6ZCipL3XhaSA__&Key-Pair-Id=KK4HN3OO4AT5R',
//             w480: 'https://cdn.movieofthenight.com/show/68/poster/horizontal/en/480.jpg?Expires=1769132487&Signature=MdrvTl1FEJESYakKwAQDUP0Td0Hn~~iQyCzCLvoS5-f8oWexFA~wFHHDm0cmCksbC17ltAxaK46vd6Y6Fl-Mn0c-fVHSoDbywkeQWge-dUqp4S38iUjryiuO6dSvdWoTvJsXyeCdYSK3CrqSk07fO1nBrcrojSv~jgSjYlX307S10KFMFZ-h4yKEDhiUoXCBcJcaZqYN~JbUhZy-6yoXIX6ZPmSombcPYfgwXhq4VV-UNZ3tu6iuqTxNij5aZgorb8bLRUzCPPP1RbM6X4ogz~5hNKAofnd719~TJ2DVMhRgCKhpduBXCpseOEMF~y4nhMblK8tAwtSC-J1EvcuySA__&Key-Pair-Id=KK4HN3OO4AT5R',
//             w720: 'https://cdn.movieofthenight.com/show/68/poster/horizontal/en/720.jpg?Expires=1769132487&Signature=X-vmRshrfKySRXoRFI4J8aV7spk4t~T4GfZhg0MgEElTvfF~~aIIw4rJluXhjCjUskkRcvXM3BJlqTyhVSV6bW1pn~hbqK0Vvz37BRYGVIrOfLW2yR1-mOiDtzDKB7n5tBcA6dFPL0H9dnAqd1322Eant~dmP3iOzH0zolSVVstw2g8L1W~vvB-Or-DSDdG-m5XFrQCgrQx4HUN64W~8Zfawdy-yqFpcibI0t3KmYUyrUC1WmMbub9Ey2-Q5hsLoNrgxIrYtkR2WGAmG8T9Z9RQSGWxUsCxaSVUFoFgsfLO5nb9g4OO329aMl76-U-EvhIKV4gv8VxvDq4S7T7SRMA__&Key-Pair-Id=KK4HN3OO4AT5R',
//             w1080: 'https://cdn.movieofthenight.com/show/68/poster/horizontal/en/1080.jpg?Expires=1769132487&Signature=lWxsrOgH1RZZASQ6VTc6m4VYY~wepkPzyoldad~KjeRh7I2KoEzWO3wX2eYi0apcz7Is95oR8Og7meFVYcrYEfd3dpOvbquVrM2~~BMbbyy0GXOA8QREJmMCVWxEKEYmssDVthtlNxdmI1i4VjRyfmOGCOGirXF1kIVvxaYCrKt7B0M7-ycrNH-~1V3Twvozw5tq0HRjZQnZBJZ0ZOb4LCYaZgfKJhOHQtUqkw66F4Tuzvl17IjpcoeXtOmmqsyreVvkylGF3R7mDRJTxe2pgXbNuG0YhL3XWDeyQ3WKAqhzmU~e4-xGz8ymlNP2~btOjP7tdYJJBMu5QTLp9Z7ZCg__&Key-Pair-Id=KK4HN3OO4AT5R',
//             w1440: 'https://cdn.movieofthenight.com/show/68/poster/horizontal/en/1440.jpg?Expires=1769132487&Signature=OfEUTzPITpzsdLDEW2qkZU7~4mooLH45FZ-1Sev8nAOMh1ZNK4fAQKxlAFG-sghYHMPCQJC9AR~05cOok4W7d~4XowkDVm0OIjXDqz5dIfaMV3AKCirg3EcPxowIxMcMdaMWHTe8JVRt627jWRQLIJaaWJkLhr0FevzINUY8IuudRl2Y5ldhMKsW9MFpnOfYcpaPV-6JIh6t2xGqMJwY8zQeuehKLW85XDS01QlG6rtWChSDX~AJwsWWKS-PsCcjUDXkJRX2QCofja88zEnn-W4rqUHGnkl3cShzNwpiGPfwF~nxi4l1JOTAvO1kQYrgF1IiyT2QS4JWwGfv1bzvmA__&Key-Pair-Id=KK4HN3OO4AT5R'
//         },
//         verticalBackdrop: {
//             w240: 'https://cdn.movieofthenight.com/show/68/backdrop/vertical/240.jpg?Expires=1769132477&Signature=jTju7IqcU1tbRctr~19ypjCBDhnI1W8UmkuC8B0BgHMDkxTu0mnVr76songqmw6PguYb22-rQwKxUYnSUdiRg5f69hZK2AzhQj5AehV32Lg~zIcroCmNdt0t1ZbV5Fxr3pl04qrwF~Zu3bdBFDoAVf6rl9VeAv-4ibp8vqpx-~ezT7wUvH9t72TPLa3I0QM6825MMlonKGpRefCqekujbRg94tW3tvMIwqOXEdKKtjLeSTaG6sD1NHAUoWYD2oUWa5~3XSUeuw9FQ~jy0VeKpNDxQPBj~klMRpXk2IyVG8s9-qEYIthVGTj93D1qkPtbEuhFwdYBJWG8QxcnyyoXBQ__&Key-Pair-Id=KK4HN3OO4AT5R',
//             w360: 'https://cdn.movieofthenight.com/show/68/backdrop/vertical/360.jpg?Expires=1769132477&Signature=fxnmwhpxVgqsKt~szGMqYUKbGNI8Hyw5ZFQVxfvx4SHDaMKu5uMpqZFfcKTxBxQh1ncvf5N3-Gw41WAPHMQYokSANUxiB3Lce9vzY-ycvBdheaYVkfbETx5oxv3lyBSGISVRYzxQTB9RLQ2CtloEx4RBAZTdLKRTZ2bBV4eBeEOJHveJSg1lo2J~zVp459S7YgY8s93dVru8amGXTx58hWAxnusog958NLGDBVxr3PwYUsKy2Y-TEbXyxG~byEXLF2wtXOoFokNjePaAaRIsXC4uHlb64FUvTp9kX-xdoeLwOM3zfCxM78MC7BXp20Jb2bRggSe4diLirfugsNQyDw__&Key-Pair-Id=KK4HN3OO4AT5R',
//             w480: 'https://cdn.movieofthenight.com/show/68/backdrop/vertical/480.jpg?Expires=1769132477&Signature=FwcVH8B-RgmTPp0vGDtHh-TnhUISU7vdcL4m~~WffkZ7lJkWEw~9ZQkqieEKJQMXR-aGUqKLTftnK93dgwICk3DKL~QqQAGJycbjQSHGilSAQbQQQbV7pVCiHHwfm4cpW2dnc272FIN9aNEoy0CI2FvCTdKo46ffkKL23lACxUp0n9diYKyqK3h0yJKynQvo~DoX~Y3F9Dr4~Vk-Xv~ZfXlhspiE6b3bFj~wVF-MesmIEUwAHAAi4pIkw9ZgdY-hj-~P~0z7GQY9f4I~nmKqqElcQIqJhl2ErbjHsLqKuvSGmtb9XpSZITK~HiDUzbu125xi1xyUgAAI8WyVOS2mJA__&Key-Pair-Id=KK4HN3OO4AT5R',
//             w600: 'https://cdn.movieofthenight.com/show/68/backdrop/vertical/600.jpg?Expires=1769132477&Signature=MLIzTCbxbm0ZQ9qMGSEZAAI8RikR15PY358Cbo2ccR~S2E938B-4nA~5D8lDSw1VaCIPI9UoXdk2xojwqSBcBKbONf6plXhkbqqTmCTNtYoYy~LPS02v0-MOSMtssH6OnJSzF5UrfyPNIhNSgqopMV3NJi8wTHyzqamPk0oIz19GKphcm5lZ4vLGiSfe9KmQX0DUYOFwe47ydt0jcXkSfhoJhNVG2M04DwXHB7n~iv8gTRSW6n5RgikTrTxOS03KCvo8YKDHqG6zJR~YXtwfp561tcWQyhXF7LxeDTcpvTdNyNisRmjvtijtAdBSw7isbu70hYIghr4GR1WOj3gWHA__&Key-Pair-Id=KK4HN3OO4AT5R',
//             w720: 'https://cdn.movieofthenight.com/show/68/backdrop/vertical/720.jpg?Expires=1769132477&Signature=Yo3UtxynaQxErnCLQQc1BrCp4lsuamuQvVc~-MSKAA-NzAH2-K7sw9aT5vSj6~j5BEZtIF55979lMSZu5Tq0hhzh~wNxylbq0Zp8eFnZtYM3n56-jmAyx3gMrOqr1r2jqJA4Sq1PTWG9KvtgY5AoJ2kBTFHm7TnNfPY1wGyVd1l0tV6FWWztVQGPtF8i8XYzMamQ35YIa3bji7FTjSdYKlg377Pbq9vuVs5A6GQFVn2Qx4cpY4027~Ll-sw5cTXc5BY1XCe~bKwuPbHzqxz3aWGixlM8Vz~3kBASomoJgEbuLCvyqhJGcgpXjBLC73cknXnpiuTU-0MNnSyZlTm6pw__&Key-Pair-Id=KK4HN3OO4AT5R'
//         },
//         horizontalBackdrop: {
//             w360: 'https://cdn.movieofthenight.com/show/68/backdrop/horizontal/360.jpg?Expires=1769132479&Signature=Dl8EfLNOA4Wx9cvjE41ejOCSou1lTarVtBEjYNkdA-BRp2ogsiFtKc97GhfHGUCF1plxdtrSltng8sEeCUZ52WJmrUOue0pWUod3WgG4q2kxnFfqNKvd7FPeVfKdpuvBFqG4T7mfy6eHrff5YQyvsW-~q64dhrjs2AlbTpGd5~kMKKD2MDqaA9SgR5Ubf2Wd5xt-LfTiIkbBmTMZZGRwpf~oFvrQNpS~ecgm0TM3KuAA3M4ek~v-5BSjBKtgfpNKXOwi8W2mSAgDfjP35jAGEGE4v-teQW0yQhSmQnG3jJa0sSrkefhCuyQHT7UoMbGLhxNUjZzYdPIW2yeyGcPJrg__&Key-Pair-Id=KK4HN3OO4AT5R',
//             w480: 'https://cdn.movieofthenight.com/show/68/backdrop/horizontal/480.jpg?Expires=1769132479&Signature=Az8fpqKNo~yPyr2G8gycYdVr4UL2pu8bpt4TB4fSyWPZHFamogL8BfUYlig6sCWtGGw1EUBZM3EsM86G-5cSy8uFwBQzGT4QDNenInGl-R~attAoyUH9vfC18I07MQbIFNl1DuJEAji2Z3b-ASyHgDUP52Kuy36RXip~VXUewYWW3~Iu-WrKTJWjKdFEGDW9xeXaA1WBAuwqto2K0H7V5ae8YfpVjRBWCxfRsWOQyQVGvtKgzKq1f09zoKJ4YvEml-eFQunsoF974fzR0CvLhDXtjhGofS4ffTZtlAiuEBTJO~hmkZMAlZM9tK2b9rMhivB6Gm2qGzQh5pv1k04iKw__&Key-Pair-Id=KK4HN3OO4AT5R',
//             w720: 'https://cdn.movieofthenight.com/show/68/backdrop/horizontal/720.jpg?Expires=1769132479&Signature=SbOxsyv3wNLOG00IUY1CwI1Ey84BHEiV2wx5uxp9vxlwilrFfnQ9b~HN1rqrW7OaX2-xKLzxMvJKijinX36Nb-HMNQ-FUm8g25JLQkkeq-eJLZJYNc5o7zz0Wst3p8wMprI-M-nfJ7vhgzJMvqbl0HZePFoc0rB8AMpRpIoGSpaRtrE62lwgQz0O~uSnCcZW~5I4bAw~hrhlJghb3yN5ISkomNxL3s5Tz2OBWE~A-AeR1P3f2nrRfAZh-p20TTKg61ffQ~qd~oif9vzeRqhsZN1P9qif7wM4mUXPb5~jvI63K9RnzgbUbZLX00U0ZqkDR8G5uzc1pDSnqJOeMdVNRw__&Key-Pair-Id=KK4HN3OO4AT5R',
//             w1080: 'https://cdn.movieofthenight.com/show/68/backdrop/horizontal/1080.jpg?Expires=1769132479&Signature=bv88sj3aWH-I1kEtRIu2o3yNMmEsLWqk13Sl7s0LbYVurKHUGHmLyhbCwjw59g47Co6NPBGQuS-sM5Bq5MIiSOs4vJcvkgfnYOM-1Cup871p8Bn3167kbXzPROhbqqY6AjMwKVMFZ1X3uLkeF5-QZFmMqG50bdzpImOYHreVoSDkMaeJ95KSSmQdCSQaFnxO6CAEgHZ5dDH-8ziTjibLaDTif3mQCmGF2lenZISCcvpud~hFst~C4rfOm9hnxrN76YRvE6tFpSdIe2DsgYqmcNiSVsMtHxcdXJ2i3hQA5eh5FtUP1xddNtMR7ZuLXVJqAD20lZTt5AQ1hbdS0MhwyA__&Key-Pair-Id=KK4HN3OO4AT5R',
//             w1440: 'https://cdn.movieofthenight.com/show/68/backdrop/horizontal/1440.jpg?Expires=1769132479&Signature=VYDShenYeZxTsD1a-10o5JUxO5rU-bBI~TO-DhsOqDpQk5R0BEXftnXhSgX9Q8jmrzYEXAgAtthm1~5NDvqsa2IPkxqatqb3V0te-sFO2Zj~uwEQ2dDgJYwXmFmTQVaxsPWKbU5i1-OztOH8hmzuZS~mIyia~4HhlgcyqEUwitZIC2fYcIInNysSOd6750y77E0puXIOCTiJ5gaWtcqQzQuO32oiNXtYKFTjHFoS9JorFlKJGMxirtlt69fgBL3rFPmQaj5oOB0iGQQVzKOFjdPSDmDeumZB8QWxAZsOX9g6ll4I9KLaBLlLnbbyJWD2lpaKd97VF3BN5kW0CL3r8Q__&Key-Pair-Id=KK4HN3OO4AT5R'
//         }
//     },
//     streamingOptions: { us: [ [Object], [Object], [Object], [Object] ] },
//     seasons: undefined
// }