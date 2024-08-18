const {
    generateInviteToken,
    generateInviteCode,
    getInviteToken,
} = require("../helpers/organizationInvite")

const User = require("../models/user")
const Creator = require("../models/creator")

const authCreatorInfo = async (req, res) => {
    const { userId } = req

    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    if (!user.creator) {
        return res.status(403).json({ message: "User is not a creator" })
    }

    const creator = await Creator.findOne(
        { contributors: { $elemMatch: { userRef: userId } } },
        { contributors: { $elemMatch: { userRef: userId } }, __v: 0 },
    )

    if (!creator) {
        return res.status(404).json({ message: "Creator not found" })
    }

    const creatorDetails = creator.toObject()

    const isOwner = creator.contributors.some(
        (contributor) => contributor.userRef === userId && contributor.role === "owner",
    )

    if (!isOwner) {
        delete creator.joinRequests
    }

    if (creator.displayPicture.small) {
        creatorDetails.displayPicture = creator.displayPicture.small
    } else {
        creatorDetails.displayPicture = creator.displayPicture.large
    }

    creatorDetails.user = creatorDetails.contributors[0]

    if (creatorDetails.invite) {
        delete creatorDetails.invite.token
        delete creatorDetails.invite._id
    }

    return res.json(creatorDetails)
}

const updateContributorDescription = async (req, res) => {
    const userId = req.userId
    const { description } = req.body

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const creator = await Creator.findById(user.creatorId)
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" })
        }

        const contributor = creator.contributors.find(
            (contributor) => contributor.userRef === user._id.toString(),
        )

        if (!contributor) {
            return res.status(404).json({ message: "Contributor not found" })
        }

        if (creator.type === "individual") {
            return res
                .status(400)
                .json({ message: "Adding people is not allowed for individual creators" })
        }

        contributor.description = description

        await creator.save()

        return res.json({ message: "Description updated successfully" })
    } catch (error) {
        console.error("Error updating description:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

const updateContributorID = async (req, res) => {
    const userId = req.userId
    const { id: newId } = req.body

    try {
        // validate id, it should be all small letters and only - numbers
        const idRegex = /^[a-z0-9-]+$/
        if (!idRegex.test(newId)) {
            return res.status(400).json({
                message:
                    "ID not allowed. Only small letters, numbers and hypens(-) are allowed",
            })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const creator = await Creator.findById(user.creatorId)
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" })
        }

        const contributor = creator.contributors.find(
            (contributor) => contributor.userRef === user._id.toString(),
        )

        if (!contributor) {
            return res.status(404).json({ message: "Contributor not found" })
        }

        if (creator.type === "individual") {
            return res
                .status(400)
                .json({ message: "Adding people is not allowed for individual creators" })
        }

        if (contributor.userRef === userId) {
            if (newId) {
                contributor.id = newId
                await creator.save()
                return res.json({ message: "ID updated successfully" })
            } else {
                return res.status(400).json({ message: "ID cannot be empty" })
            }
        }

        // Check if anyone else is using the same ID
        const otherContributor = creator.contributors.find(
            (contributor) => contributor.id === newId && contributor.userRef !== userId,
        )

        if (otherContributor) {
            return res.status(400).json({ message: "ID is already in use" })
        }

        contributor.id = newId

        await creator.save()

        return res.json({ message: "ID updated successfully" })
    } catch (error) {
        console.error("Error updating ID:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

const activateContributor = async (req, res) => {
    const userId = req.userId

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const creator = await Creator.findById(user.creatorId)
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" })
        }

        const contributor = creator.contributors.find(
            (contributor) => contributor.userRef === userId,
        )

        if (!contributor) {
            return res.status(404).json({ message: "Contributor not found" })
        }

        if (!contributor.id || !contributor.description) {
            return res.status(400).json({ message: "Contributor is not complete" })
        }

        if (creator.type === "individual") {
            return res
                .status(400)
                .json({ message: "Adding people is not allowed for individual creators" })
        }

        if (contributor.status === "active") {
            return res.status(400).json({ message: "Contributor is already active" })
        }

        contributor.status = "active"

        await creator.save()

        return res.json({ message: "Contributor activated successfully" })
    } catch (error) {
        console.error("Error activating contributor:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

const getCreatorInviteCode = async (req, res) => {
    const userId = req.userId

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const creator = await Creator.findById(user.creatorId)
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" })
        }

        if (creator.type === "individual") {
            return res
                .status(400)
                .json({ message: "Adding people is not allowed for individual creators" })
        }

        let inviteDetails = await getInviteToken(creator)
        if (!inviteDetails) {
            return res.status(200).send("No invite code available")
        }

        return res.json({ invite: inviteDetails })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

const generateAndReturnInviteCode = async (req, res) => {
    const userId = req.userId

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const creator = await Creator.findById(user.creatorId)
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" })
        }

        if (creator.type === "individual") {
            return res
                .status(400)
                .json({ message: "Adding people is not allowed for individual creators" })
        }

        let inviteDetails = await getInviteToken(creator)
        if (inviteDetails) {
            return res.status(400).json({ message: "Invite token already exists" })
        }

        const inviteCode = generateInviteCode()
        inviteDetails = await generateInviteToken(inviteCode)

        creator.invite = {
            code: inviteDetails.code,
            token: inviteDetails.token,
        }

        await creator.save()

        return res.json(inviteDetails)
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

const approveJoinRequest = async (req, res) => {
    const userId = req.userId
    const { requestUserRef } = req.body

    try {
        const creator = await Creator.findOne({ owner: userId })
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" })
        }

        if (creator.type === "individual") {
            return res
                .status(400)
                .json({ message: "Adding people is not allowed for individual creators" })
        }

        const joinRequestIndex = creator.joinRequests.findIndex(
            (request) => request.userRef === requestUserRef,
        )

        if (joinRequestIndex === -1) {
            return res.status(404).json({ message: "Join request not found" })
        }

        const joinRequest = creator.joinRequests[joinRequestIndex]

        // Move the join request to contributors
        creator.contributors.push({
            name: joinRequest.name,
            role: joinRequest.role,
            userRef: joinRequest.userRef,
            displayPicture: joinRequest.displayPicture,
            status: "approved",
        })

        // Remove the join request
        creator.joinRequests.splice(joinRequestIndex, 1)

        await creator.save()

        await User.findByIdAndUpdate(
            requestUserRef,
            { creator: true, creatorId: creator._id },
            { new: true },
        )

        res.json({ message: "Join request approved successfully" })
    } catch (error) {
        console.error("Error in approveJoinRequest:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const denyJoinRequest = async (req, res) => {
    const userId = req.userId
    const { userRef: requestUserRef } = req.body

    try {
        const creator = await Creator.findOne({ owner: userId })
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" })
        }

        const joinRequestIndex = creator.joinRequests.findIndex(
            (request) => request.userRef === requestUserRef,
        )

        if (joinRequestIndex === -1) {
            return res.status(404).json({ message: "Join request not found" })
        }

        // Remove the join request
        creator.joinRequests.splice(joinRequestIndex, 1)

        await creator.save()

        res.json({ message: "Join request denied successfully" })
    } catch (error) {
        console.error("Error in denyJoinRequest:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const getOrganizationAuthors = async (req, res) => {
    const userId = req.userId

    try {
        const creator = await Creator.findOne({
            contributors: { $elemMatch: { userRef: userId } },
        })

        if (!creator) {
            return res.status(404).json({ message: "Creator not found" })
        }

        const isOwner = creator.contributors.some(
            (contributor) => contributor.userRef === userId && contributor.role === "owner",
        )

        const authors = creator.contributors.filter(
            (contributor) => contributor.role === "author" || contributor.role === "owner",
        )

        const creatorDetails = {
            name: creator.name,
            id: creator.id,
            type: creator.type,
            displayPicture: creator.displayPicture.small || creator.displayPicture.large,
        }

        return res.json({ creator: creatorDetails, authors, owner: isOwner })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

const updateAuthorAccess = async (req, res) => {
    const userId = req.userId
    const { id } = req.params
    const { updateStatus } = req.body

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const creator = await Creator.findById(user.creatorId)
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" })
        }

        const isOwner = creator.contributors.some(
            (contributor) => contributor.userRef === userId && contributor.role === "owner",
        )

        if (!isOwner) {
            return res.status(403).json({ message: "You are not authorized to do this action" })
        }

        const author = creator.contributors.find((contributor) => contributor.id === id)

        if (!author) {
            return res.status(404).json({ message: "Author not found" })
        }

        let message
        if (updateStatus === "pause") {
            author.status = "paused"
            message = `${author.name}'s access to ${creator.name} is paused.`
        } else if (updateStatus === "active") {
            author.status = "active"
            message = `${author.name}'s access to ${creator.name} is resumed.`
        } else if (updateStatus === "delete") {
            creator.contributors.splice(creator.contributors.indexOf(author), 1)
            message = `${author.name} is removed from ${creator.name}.`
        }

        await creator.save()

        return res.json({ success: true, message })
    } catch (error) {
        console.error("Error updating author access:", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

module.exports = {
    authCreatorInfo,
    updateContributorDescription,
    updateContributorID,
    activateContributor,
    getCreatorInviteCode,
    generateAndReturnInviteCode,
    approveJoinRequest,
    denyJoinRequest,
    getOrganizationAuthors,
    updateAuthorAccess,
}
