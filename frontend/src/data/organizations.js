export const organizations = [
    {
        name: "New yorker",
        icon: "https://source.unsplash.com/48x48",
        id: "new-yorker",
        image: "https://source.unsplash.com/random",
        description:
            "The New Yorker is an American weekly magazine featuring journalism, commentary, criticism, essays, fiction, satire, cartoons, and poetry.",
        followers: 123,
        verified: true,
        type: "organization",
        subscription: [
            {
                name: "Premium",
                features: [
                    "One week of early access for every new post",
                    "One Exclusive content every week",
                ],
                pricing: [
                    {
                        type: "monthly",
                        price: 10,
                    },
                    {
                        type: "yearly",
                        price: 100,
                    },
                ],
            },
        ],
    },
]
