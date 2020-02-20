import Channel from "../models/channel";

const getChannels = () => {
    return Channel.find().select('-__v');
}

const getChannel = (channelname) => {
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
    // const oldChannel = getChannel(id);
    // const newChannel = { ...oldChannel, ...channel };
    // return newChannel.save();
    return Channel.findByIdAndUpdate(id, channel);
}

const getCommands = (channelname) => {
    return getChannel(channelname)
        .select("commands");
}

const getCommand = async (channelname, commandName) => {
    const channel = await getChannel(channelname);
    if (channel === null) {
        console.warn(`Tried to find Channel ${channelname}, but didnt found it...`);
        return;
    }
    return channel.commands.find(command => command.name === commandName);
}

const setCommands = async (channelname, commands) => {
    const channel = await getChannel(channelname);
    const newChannel = { ...channel, commands };
    return Channel.findByIdAndUpdate(channelname, newChannel, { new: true });
}

const updateCommand = async (channelname, newCommand) => {
    let newCommands = [];

    const channel = await getChannel(channelname);
    if (!channel) {
        return;
    }
    delete channel._id;
    const commands = channel.commands;
    // console.log("Commands:", commands);

    const oldCommand = commands.find(command => command.name === newCommand.name);
    //Insert
    if (oldCommand === undefined) {
        newCommands = [...commands, newCommand];
    } else { //Update
        newCommands = [...commands];
        newCommands[commands.indexOf(oldCommand)] = newCommand;
    }

    // console.log('New Commands:', newCommands);
    channel.commands = [...newCommands];
    channel.save();
}

const deleteCommand = async (channelname, commandname) => {
    const commands = await getCommands(channelname);
    const newCommands = commands.filter(command => command.name !== commandname);
    return setCommands(channelname, newCommands);
}

export default {
    getChannels,
    getChannel,
    createChannel,
    updateChannel,
    getCommands,
    getCommand,
    updateCommand,
    deleteCommand
}