const randomGradient = (setGradient) => {
    const colors = [
        "#FFEFD5",
        "#E9F5DB",
        "#D5F5E3",
        "#E0FFFF",
        "#FAFAD2",
        "#FFF5EE",
        "#F0F8FF",
        "#F5F5DC",
    ]

    let randomColor1, randomColor2

    do {
        randomColor1 = colors[Math.floor(Math.random() * colors.length)]
        randomColor2 = colors[Math.floor(Math.random() * colors.length)]
    } while (randomColor1 === randomColor2)

    const randomGradient = `linear-gradient(to right, ${randomColor1}, ${randomColor2})`
    setGradient(randomGradient)
}

export { randomGradient }
