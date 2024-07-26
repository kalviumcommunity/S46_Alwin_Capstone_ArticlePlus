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

    if (creator.displayPicture.small) {
        creatorDetails.displayPicture = creator.displayPicture.small
    } else {
        creatorDetails.displayPicture = creator.displayPicture.large
    }

    creatorDetails.user = creatorDetails.contributors[0]

    delete creatorDetails.contributors

    return res.json(creatorDetails)
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
            id: joinRequest.id,
            role: joinRequest.role,
            userRef: joinRequest.userRef,
            displayPicture: joinRequest.displayPicture,
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

module.exports = {
    authCreatorInfo,
    getCreatorInviteCode,
    generateAndReturnInviteCode,
    approveJoinRequest,
    denyJoinRequest,
}
