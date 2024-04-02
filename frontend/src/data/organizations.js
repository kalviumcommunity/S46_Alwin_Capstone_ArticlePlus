export const organizations = [
    {
        name: "New yorker",
        icon: "https://api.dicebear.com/6.x/initials/svg?seed=New%20Yorker",
        id: "new-yorker",
        image: "https://source.unsplash.com/random",
        description:
            "The New Yorker is an American weekly magazine featuring journalism, commentary, criticism, essays, fiction, satire, cartoons, and poetry.",
        followers: 123,
        subscribers: 52,
        verified: true,
        type: "organization",
        articles: {
            total: 16,
            free: 2,
            subscription: 14,
        },
        subscriptions: [
            {
                name: "premium",
                features: [
                    "One week of early access for every new post",
                    "One Exclusive content every week",
                ],
                pricing: [
                    {
                        plan: "premium",
                        type: "monthly",
                        price: 299,
                    },
                    {
                        plan: "premium",
                        type: "yearly",
                        actualPrice: 3588,
                        discount: 598,
                        price: 2990,
                    },
                ],
            },
        ],
    },
    {
        name: "The New york times",
        icon: "https://api.dicebear.com/6.x/initials/svg?seed=New%20Yorker",
        id: "the-new-york-times",
        image: "https://source.unsplash.com/random",
        description:
            "The New York Times is an American daily newspaper based in New York City. The New York Times covers domestic, national, and international news, and comprises opinion pieces, investigative reports, and reviews.",
        followers: 621,
        subscribers: 139,
        verified: true,
        type: "organization",
        articles: {
            total: 12,
            free: 1,
            subscription: 11,
        },
        subscriptions: [
            {
                name: "premium",
                features: [
                    "One week of early access for every new post",
                    "One Exclusive content every week",
                ],
                pricing: [
                    {
                        plan: "premium",
                        type: "monthly",
                        price: 199,
                    },
                    {
                        plan: "premium",
                        type: "yearly",
                        actualPrice: 2388,
                        discount: 398,
                        price: 1990,
                    },
                ],
            },
        ],
    },
]
