const isMod = (tags, exclusive = false) => {
    if (exclusive) return tags.mod;
    return isBroadcaster || tags.mod;

}

const isBroadcaster = (tags) => {
    return tags.badges.broadcaster;
}

const isSub = (tags) => {
    return tags.subscriber;
}

export default {
    isMod,
    isBroadcaster,
    isSub
}