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

const getCommands = (channelname) => {
    return getChannel(channelname)
        .select("commands");
}

const getCommand = async (channelname, commandName) => {
    const channel = await getChannel(channelname);
    return channel.commands.find(command => command.name === commandName);
}

const setCommands = async (channelname, commands) => {
    const channel = await getChannel(channelname);
    const newChannel = { ...channel, commands };
    return Channel.findByIdAndUpdate(channelname, newChannel, { new: true });
}

const updateCommand = async (channelname, newCommand) => {
    // DBchannel.save();
    let newCommands = [];

    const channel = await getChannel(channelname);
    delete channel._id;
    const commands = channel.commands;
    console.log("Commands:", commands);

    const oldCommand = commands.find(command => command.name === newCommand.name);
    //Insert
    if (oldCommand === undefined) {
        newCommands = [...commands, newCommand];
    } else { //Update
        newCommands = [...commands];
        newCommands[commands.indexOf(oldCommand)] = newCommand;
    }

    console.log('New Commands:', newCommands);
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
    getCommands,
    getCommand,
    updateCommand,
    deleteCommand
}