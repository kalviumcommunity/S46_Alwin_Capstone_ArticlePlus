export const creators = [
    {
        id: "nicholas-d-lowry",
        name: "Nicholas D Lowry",
        image: "https://source.unsplash.com/random",
        followers: 321,
        articles: {
            total: 5,
            free: 1,
            subscription: 4,
        },
        verified: true,
        description:
            "Hey there! I'm Nicholas D Lowry, and I love sharing my art with the world. Thanks for stopping by!",
        type: "individual",
        subscription: true,
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
        id: "david-d-kirkpatrick",
        name: "David D Kirkpatrick",
        image: "https://source.unsplash.com/random",
        followers: 623,
        articles: {
            total: 12,
            free: 3,
            subscription: 9,
        },
        verified: true,
        subscription: false,
        description:
            "David D Kirkpatrick is an investigative journalist uncovering stories that matter.",
        type: "organization",
        organization: {
            name: "New yorker",
            icon: "https://source.unsplash.com/48x48",
            id: "new-yorker",
        },
    },
    {
        id: "jay-caspian-kang",
        name: "Jay Caspian Kang",
        image: "https://source.unsplash.com/random",
        followers: 397,
        articles: {
            total: 7,
            free: 1,
            subscription: 8,
        },
        subscription: true,
        verified: true,
        description:
            "Hey there! It's Jay Caspian Kang, and I love writing about issues that matter to me. Thanks for reading!",
        type: "individual",
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
        id: "paige-williams",
        name: "Paige Williams",
        image: "https://source.unsplash.com/random",
        followers: 213,
        articles: {
            total: 4,
            free: 1,
            subscription: 3,
        },
        verified: true,
        subscription: false,
        description:
            "Paige Williams is an investigative journalist with a keen eye for detail.",
        type: "organization",
        organization: {
            name: "New yorker",
            id: "new-yorker",
            icon: "https://source.unsplash.com/48x48",
        },
    },
]
