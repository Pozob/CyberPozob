import Channel from "../models/channel";
import Command from "../models/commands";

const getChannels = async (includeCommands = false) => {
    const channels = await Channel.find().select('-__v');
    if (!includeCommands) return channels;
    return channels;
}

const getChannel = (channelname, includeCommands = false) => {
    return Channel
        .findOne({ _id: channelname })
        .select("-__v");
}

const createChannel = (channelname) => {
    const channel = new Channel({ _id: channelname });
    return channel.save();
}

const updateChannel = async (channel) => {
    const id = channel._id;
    delete channel._id;
    return Channel.findByIdAndUpdate(id, channel);
}

const getCommand = async (channelName, commandName) => {
    return Command.findOne({ name: commandName, channel: channelName })
        .select('-__v')
        .then(command => command)
        .catch(err => console.log(err));
}

const getCommandsForChannel = (channelName) => {
    return Command.find({ channel: channelName })
        .select('-__v');
}

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
}

const deleteCommand = async (channelname, commandname) => {
    const oldCommand = await getCommand(channelname, commandname);
    if (oldCommand) Command.findByIdAndDelete(oldCommand._id);
}

export default {
    getChannels,
    getChannel,
    createChannel,
    updateChannel,
    getCommand,
    getCommandsForChannel,
    updateCommand,
    deleteCommand
}