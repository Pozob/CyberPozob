import Channel from '../models/channel';
import Command from '../models/commands';

/**
 * Returns all Channels from the Database
 */
const getChannels = async () => {
    const channels = await Channel.find().select('-__v');
    return channels;
};

/**
 * Gets a specific Channel from the Database
 * @param {String} channelname Name of the channel, without the '#'
 */
const getChannel = (channelname) => {
    return Channel.findOne({ _id: channelname }).select('-__v');
};

/**
 * Save a new Channel to the Database
 * @param {String} channelname
 */
const createChannel = (channelname) => {
    const channel = new Channel({ _id: channelname });
    return channel.save();
};

/**
 * Updates the given Channel.
 * @param {*} channel The Channel Object. Must match the DB Schema
 */
const updateChannel = async (channel) => {
    const id = channel._id;
    delete channel._id;
    return Channel.findByIdAndUpdate(id, channel);
};

/**
 * Gets a specific Command for a specific Channel
 * @param {String} channelName
 * @param {String} commandName
 */
const getCommand = async (channelName, commandName) => {
    return Command.findOne({ name: commandName, channel: channelName })
        .select('-__v')
        .then((command) => command)
        .catch((err) => console.log(err));
};

/**
 * Returns all Command for the given Channel
 * @param {String} channelName
 */
const getCommandsForChannel = (channelName) => {
    return Command.find({ channel: channelName }).select('-__v');
};

/**
 * Updates a Command for a Channel
 * @param {String} channelname
 * @param {*} newCommand
 */
const updateCommand = async (channelname, newCommand) => {
    const oldCommand = await getCommand(channelname, newCommand.name);
    if (!oldCommand) {
        new Command(newCommand).save();
    } else {
        //Maybe rework this
        const { config, roles, reply } = newCommand;
        oldCommand.config = config;
        oldCommand.roles = roles;
        oldCommand.reply = reply;
        oldCommand.save();
    }
};

/**
 * Deletes a Command from a Channel
 * @param {String} channelname
 * @param {String} commandname
 */
const deleteCommand = async (channelname, commandname) => {
    const oldCommand = await getCommand(channelname, commandname);
    if (oldCommand) Command.findByIdAndDelete(oldCommand._id);
};

export default {
    getChannels,
    getChannel,
    createChannel,
    updateChannel,
    getCommand,
    getCommandsForChannel,
    updateCommand,
    deleteCommand,
};
