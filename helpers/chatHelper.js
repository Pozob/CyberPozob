const isMod = (user, exclusive = false) => {
    if (exclusive) return user.mod;
    return user.mod || isBroadcaster(user);
};

const isBroadcaster = user => {
    return user.badges.broadcaster;
};

const isSub = user => {
    return user.subscriber;
};

export default {
    isMod,
    isBroadcaster,
    isSub
};
