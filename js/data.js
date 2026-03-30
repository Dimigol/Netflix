const epicItems = [
    {
        img: "https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/3a3c6316-74c2-436b-ac94-9ca61e1e555c/compose?aspectRatio=1.78&format=webp&width=1200",
        top10: true,
        badge: "Clássico",
        progress: 0,
        youtube: "https://www.youtube.com/watch?v=qIYyXcCwvKc",
        title: "Star Wars: Episódio III - A Vingança dos Sith"
    },
    {
        img: "https://aventurasnahistoria.com.br/wp-content/uploads/entretenimento/gladiador_2_VvnGVes.jpg",
        progress: 0,
        youtube: "https://www.youtube.com/watch?v=cXg62-t8BWs",
        title: "Gladiador"
    },
    {
        img: "https://i.ytimg.com/vi/OQgySPQ5M3Y/maxresdefault.jpg",
        progress: 0,
        youtube: "https://www.youtube.com/watch?v=zckJCxYxn1g",
        title: "O Senhor dos Anéis: O Retorno do Rei"
    },
    {
        img: "https://br.web.img3.acsta.net/medias/nmedia/18/90/93/20/20120876.jpg",
        progress: 0,
        youtube: "https://www.youtube.com/watch?v=SaHZHU-44XA",
        title: "O Poderoso Chefão"

    }
];

const seriesItems = [
    {
        img: "https://m.media-amazon.com/images/M/MV5BMTJiMzgwZTktYzZhZC00YzhhLWEzZDUtMGM2NTE4MzQ4NGFmXkEyXkFqcGdeQWpybA@@._V1_.jpg",
        top10: true,
        badge: "Nova temporada",
        youtube: "https://www.youtube.com/watch?v=HhesaQXLuRY",
        title: "Breaking Bad"
    },
    {
        img: "https://occ-0-8407-2219.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABbgHMvtVm3Ke1fw6X9_bWYdEO9IEdJeXmL9E78relsKg1E8llap5ilrA89xMAQYm4yBYUQtHs9Zv3jXRXCFH59efTj72hrZu8WHm.jpg?r=21d",
        top10: true,
        youtube: "https://www.youtube.com/watch?v=oVzVdvGIC7U",
        title: "Peaky Blinders"
    },
    {
        img: "https://sm.ign.com/ign_br/screenshot/default/lupin-s2-16x9-pt-br_9pgz.jpg",
        badge: "Novo episódio",
        youtube: "https://www.youtube.com/watch?v=FoiQ-Xr8NDI",
        title: "Lupin"
    },
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxph5cVDwBtYACr-AkUM_7p_hGkpXUuVbdSA&s",
        badge: "Novidade",
        youtube: "https://www.youtube.com/watch?v=pahdCwHJjaU",
        title: "Vinland Saga"
    }
];

const marathonItems = [
    {
        img: "https://www.interactsolutions.com/wp-content/uploads/2023/10/La-Casa-de-Papel.jpg",
        top10: true,
        youtube: "https://www.youtube.com/watch?v=iS5xXr-GOnM",
        title: "La Casa de Papel"
    },
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXDCwnzLGfVUr7pAHt8klc0kGcm4l8hE3wfg&s",
        top10: true,
        badge: "Novidade",
        youtube: "https://www.youtube.com/watch?v=C2ssQOyVJqQ",
        title: "Prision Break"
    },
    {
        img: "https://img.odcdn.com.br/wp-content/uploads/2025/11/Os-Donos-do-Jogo-1920x1080.jpg",
        top10: true,
        badge: "Novo episódio",
        youtube: "https://www.youtube.com/watch?v=n7NIyrpreig",
        title: "Os donos do jogo"
    },
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpKefNh4MSJ_wpcmrmW_FAF03WK2FDSjSL4bOlmQKjrh9JCVRQk0hZ0B0XqkLuNOYVlrMxeozfi9DuwV0am7wcA5f_Z3Akm_k-2fKdGYk&s",
        top10: true,
        badge: "Novo episódio",
        youtube: "https://www.youtube.com/watch?v=ySYnTO7leqI",
        title: "Rick and Morty"
    }
];

const kidsItems = [
    {
        img: "https://m.media-amazon.com/images/S/pv-target-images/e73094c9f2b5d5aa23c47e9837e58b3011d1e33ce07605fec7e7c0f67fe69934._SX1080_FMpng_.png",
        badge: "Novo",
        youtube: "https://www.youtube.com/watch?v=lujHh0touPw",
        title: "Pocoyo"
    },
    {
        img: "https://m.media-amazon.com/images/S/pv-target-images/e57a3409a1bdd20ec162a31f3282318a022f7bdcbecb44d2da33a832258f7044.png",
        badge: "Crianças",
        youtube: "https://www.youtube.com/watch?v=snaYm8GAXjk",
        title: "Slugterra"
    },
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKoI2ZtEgVAze1gw7EN9AqZAsNVq15zn4wtw&s",
        badge: "Comédia",
        youtube: "https://www.youtube.com/watch?v=FhKIg8O4AWI",
        title: "Apenas um Show"
    },
    {
        img: "https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/ceb24031-55cb-4c96-991c-f5d8e2e0e347/compose?aspectRatio=1.78&format=webp&width=1200",
        badge: "Futebol",
        youtube: "https://www.youtube.com/watch?v=NJYDqyHWOY4",
        title: "O11ZE"
    }
];

const docuItems = [
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROezGnRaBfCljpkSQzsuWf5eGZUhwuKl0QWw&s",
        badge: "Vida real",
        youtube: "https://www.youtube.com/watch?v=QY58-tsYPVA",
        title: "Cristiano Ronaldo: O fenômeno"

    },
    {
        img: "https://aventurasnahistoria.com.br/wp-content/uploads/2024/06/hitler-3.jpg",
        badge: "Histórico",
        youtube: "https://www.youtube.com/watch?v=gxyrzZs8m4I",
        title: "Hitler"
    },
    {
        img: "https://media.gazetadopovo.com.br/2023/03/22172715/som-na-faixa.jpeg",
        badge: "Insight",
        youtube: "https://www.youtube.com/watch?v=z-kgEGKFp74",
        title: "Som na faixa"
    },
    {
        img: "https://i.ytimg.com/vi/KmpucxGB1jA/sddefault.jpg?v=5e304e33",
        top10: true,
        youtube: "https://www.youtube.com/watch?v=KmpucxGB1jA",
        title: "A historia do Cristianismo"
    }
];

const comedyItems = [
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHw3PrV4kV4VlInQ8_Nor3WaL3MPA7KUFVTw&s",
        badge: "Humor leve",
        youtube: "https://www.youtube.com/watch?v=faJAT35j5Ss",
        title: "Brooklyn Nine-Nine"
    },
    {
        img: "https://aventurasnahistoria.com.br/wp-content/uploads/curiosidades/the_office_capa.jpg",
        badge: "Stand-up",
        youtube: "https://www.youtube.com/watch?v=tNcDHWpselE",
        title: "The Office"
    },
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaduzoLhhG5hbHuZt4hei2MhQx5a0DqlYUQ&s",
        badge: "Novidade",
        youtube: "https://www.youtube.com/watch?v=seoJIPLLWp0",
        title: "As branquelas"
    },
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9WZWNRH67qbx3n_-kEB5BwSLSFJv0N5F1QA&s",
        top10: true,
        youtube: "https://www.youtube.com/watch?v=4eaZ_48ZYog",
        title: "Super Bad - É Hoje"
    }
];

const animationItems = [
    {
        img: "https://rollingstone.com.br/wp-content/uploads/2025/09/Estreia-de-Homem-Aranha-Alem-do-Aranhaverso-e-antecipada.jpg",
        badge: "Animação",
        youtube: "https://www.youtube.com/watch?v=SS6ABPkfmBE",
        title: "Homem-Aranha: Além do Aranhaverso"
    },
    {
        img: "https://sm.ign.com/t/ign_br/news/t/the-legend/the-legend-of-aang-the-last-airbender-is-the-official-title_5x21.1280.jpg",
        badge: "Fantasia",
        youtube: "https://www.youtube.com/watch?v=5llvd1Uu-iU",
        title: "Avatar: A Lenda de Aang"
    },
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd0UaNEm8XL-zhLa26ig9Ma1UFtt7xJ6Mxcg&s",
        badge: "Dublado",
        youtube: "https://www.youtube.com/watch?v=ByXuk9QqQkk",
        title: "Toy Story"
    },
    {
        img: "https://m.media-amazon.com/images/I/81lAPl9Fl0L._AC_SL1500_.jpg",
        badge: "Top 10",
        youtube: "https://www.youtube.com/watch?v=lAxgztbYDbs",
        title: "Harry Potter e o Prisioneiro de Azkaban"
    }
];

const thrillerItems = [
    {
        img: "https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/10/todo-mundo-em-panico-e1730323839101.jpg?w=1080&h=608&crop=1",
        badge: "Clima tenso",
        youtube: "https://www.youtube.com/watch?v=OqblkzpIpns",
        title: "Todo Mundo em Pânico"
    },
    {
        img: "https://upload.wikimedia.org/wikipedia/en/8/86/The_Silence_of_the_Lambs_poster.jpg",
        badge: "Mistério",
        youtube: "https://www.youtube.com/watch?v=RuX2MQeb8UM",
        title: "A Silência dos Inocentes"
    },
    {
        img: "https://upload.wikimedia.org/wikipedia/en/0/05/Gone_Girl_Poster.jpg",
        badge: "Novo episódio",
        youtube: "https://www.youtube.com/watch?v=2-_-1nJf8Vg",
        title: "Garota Exemplar"
    },
    {
        img: "https://upload.wikimedia.org/wikipedia/en/d/d9/Hereditary.png",
        top10: true,
        youtube: "https://www.youtube.com/watch?v=V6wWKNij_1M",
        title: "Hereditary"
    }
];

const natureItems = [
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRifrQUfA4qulzdAnbLRKmZSf1PjKxkYF57J7jO4m_6ICHa8U6CfH3TAcwo9OBO78GOn3O058w7kDySubji04QaVAsdTtB5G1rGDYAxxQ&s=10",
        badge: "Natureza",
        youtube: "https://www.youtube.com/watch?v=2LAuzT_x8Ek",
        title: "Nauterza Selvagem"
    },
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXamDxqTu1RjgePJVJEPUOLTXTq6TxWxLKjl9zDAx1WSAaOzUzYqfegI-rYb5Kc3Oiv56uYRpWOfe8Aau_ndAwLKYy_rqKPrvK785eKw&s=10",
        badge: "Expedições",
        youtube: "https://www.youtube.com/watch?v=tiVNk6_0GdY",
        title: "planet earth"
    },
    {
        img: "https://brunacosenza.com/wp-content/uploads/2016/02/188.jpg",
        badge: "Exploração",
        youtube: "https://www.youtube.com/watch?v=mjay5vgIwt4",
        title: "Comer Rezar Amar"
    },
    {
        img: "https://i.ytimg.com/vi/OOWqXyRL6i0/maxresdefault.jpg",
        badge: "Top 10",
        youtube: "https://www.youtube.com/watch?v=OOWqXyRL6i0",
        title: "A Vida Secreta de Walter Mitty"
    }
];

const classicsItems = [
    {
        img: "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg",
        top10: true,
        badge: "Remaster",
        youtube: "https://www.youtube.com/watch?v=sY1S34973zA",
        title: "O Poderoso Chefão"
    },
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR09NhZGalyZJFgvlgaVcaARdELHypWHJpAcQ&s",
        badge: "Drama",
        youtube: "https://www.youtube.com/watch?v=sY1S34973zA",
        title: "Taxi Driver"
    },
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd9TpFBqWR-kFtg-g2LgIJBOKJvMbcXO4lkw&s",
        badge: "Clássico",
        youtube: "https://www.youtube.com/watch?v=7E9CD3Hucws",
        title: "Uma odisséia no espaço"
    },
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8-_WL-MqH0GMg_6RmbHAQo8uCDyP8JspOpQ&s",
        badge: "Vintage",
        youtube: "https://www.youtube.com/watch?v=BkL9l7qovsE",
        title: "Casablanca"
    }
];

const plotItems = [
    {
        img: "https://m.media-amazon.com/images/S/pv-target-images/770d6a7911d4a31aed034d4c3abe049962b09fa3dec49defe9866a90fc869000.jpg",
        youtube: "https://www.youtube.com/watch?v=SUXWAEX2jlg",
        title: "O clube da luta"
    },
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVRCfB86VRkcKY65tU00E5hVP6WmPsfI19Fw&s",
        badge: "Drama",
        youtube: "https://www.youtube.com/watch?v=gL4rP2prdfg",
        title: "Ilha do Medo"
    },
    {
        img: "https://upload.wikimedia.org/wikipedia/en/9/9c/Usual_suspects_ver1.jpg",
        badge: "Clássico",
        youtube: "https://www.youtube.com/watch?v=oiXdPolca5w",
        title: "The Usual Suspects - Os Suspeitos"
    },
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1utlJiTohWQA3TWoKdQ9cRfYBd1emmtU0Zw&s",
        badge: "Vintage",
        youtube: "https://www.youtube.com/watch?v=V3CndbzAgi4",
        title: "O sexto sentido"
    }
];


const mindsetItems = [
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtW0UqWdq0F7Sm1L1vXPQHb5CwJ9LZ_PO6_Q&s",
        badge: "Interativo",
        youtube: "https://www.youtube.com/watch?v=PoSCUsNQVtw",
        title: "O lobo de Wall Street"
    },
];
const gamesItems = [
    {
        img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
        badge: "Interativo",
        youtube: "https://www.youtube.com/watch?v=U1Vw0cMBpR0"
    },
    {
        img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop",
        badge: "Studio",
        youtube: "https://www.youtube.com/watch?v=BR1u1Yq4fns"
    },
    {
        img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
        badge: "Replay",
        youtube: "https://www.youtube.com/watch?v=Rv6K0wRzQzU"
    },
    {
        img: "https://images.unsplash.com/photo-1430819749568-4c4abd7d3a12?q=80&w=600&auto=format&fit=crop",
        badge: "Gameplay",
        youtube: "https://www.youtube.com/watch?v=9hX5djf6J0Q"
    }
];

export const catalogosPorPerfil = {
    "perfil-1": [
        { title: "Épicos", items: epicItems },
        { title: "Séries", items: seriesItems },
        { title: "Para maratonar", items: marathonItems }
    ],
    "perfil-2": [
        { title: "Infantil & família", items: kidsItems },
        { title: "Documentários em foco", items: docuItems },
        { title: "Risadas leves", items: comedyItems }
    ],
    "perfil-3": [
        { title: "Animação & fantasia", items: animationItems },
        { title: "Suspense noturno", items: thrillerItems },
        { title: "Viagens & natureza", items: natureItems }
    ],
    "perfil-4": [
        { title: "Clássicos restaurados", items: classicsItems },
        { title: "Séries em alta", items: seriesItems },
        { title: "Plot Twist", items: plotItems }
    ]
};

export const defaultProfileId = "perfil-1";
