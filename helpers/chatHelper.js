/**
 * Checks if the given User is a Mod
 *
 * @param {*} user The User that should be checked
 * @param exclusive If only Mods should count as a Mod (eg. excludes Broadcaster)
 * @returns True if the User is a Mod
 */
const isMod = (user, exclusive = false) => {
    if (exclusive) return user.mod;
    return user.mod || isBroadcaster(user);
};

/**
 * Checks if the given User is the Broadcaster
 * @param {*} user
 */
const isBroadcaster = (user) => {
    return user.badges.broadcaster;
};

/**
 * Checks if the given User is a Sub
 * @param {*} user
 */
const isSub = (user) => {
    return user.subscriber;
};

export default {
    isMod,
    isBroadcaster,
    isSub,
};
