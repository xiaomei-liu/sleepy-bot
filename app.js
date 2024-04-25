import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { VerifyDiscordRequest } from "./src/utils.js";
import { InteractionResponseType, InteractionType } from "discord-interactions";
import { SleepyBotCommand } from "./src/types.js";

const app = express();
const port = process.env.PORT || "3000";
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
});
const userSelectedValues = [];

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));
app.use(helmet());
// app.use(limiter);

app.get("/", (req, res) => {
  res.send("Health check");
});

app.get("/interactions", (req, res) => {
  res.send("/Interactions Health check");
});

app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, data, id, message } = req.body;

  console.log({
    data: req.body.data,
    id: req.body.id,
    message: {
      id: req.body.message?.id,
      interaction: req.body.message?.interaction,
      interaction_metadata: req.body.message?.interaction_metadata,
      type: req.body.message?.type
    },
    type: req.body.type
  });
  console.log(userSelectedValues);

  /**
   * Handle verification requests
   */
  if (type.toString() === InteractionType.PING.toString()) {
    return res.status(200).send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type.toString() === InteractionType.APPLICATION_COMMAND.toString()) {
    const { name } = data;
    switch (name) {
      case SleepyBotCommand.TEST:
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Health check',
          },
        });
      // case WizardBotCommand.HOST:
      //   userSelectedValues[id] = []
      //   return res.send({
      //     type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      //     data: {
      //       content: 'Please fill out the form below to host a run.',
      //       components: [
      //         {
      //           type: 1,
      //           components: [
      //             HostCommandSelectEventType
      //           ]
      //         }
      //       ]
      //     }
      //   })
      default:
        return res.send({})
    }
  }

  /**
   * Handle message commands
   */
  // if (type.toString() === InteractionType.MESSAGE_COMPONENT.toString()) {
  //   const { custom_id, values } = data;
  //   const { interaction } = message;
  //   const { id: previousMessageId } = interaction;
  //   switch (custom_id) {
  //     case "host_command_1":
  //       userSelectedValues[previousMessageId].push(values[0])
  //       return res.send({
  //         type: InteractionResponseType.UPDATE_MESSAGE,
  //         data: {
  //           content: 'Please fill out the form below to host a run.',
  //           components: [
  //             {
  //               type: 1,
  //               components: [
  //                 HostCommandSelectEventChannel,
  //               ]
  //             }
  //           ]
  //         }
  //       })
  //     case "host_command_2":
  //       userSelectedValues[previousMessageId].push(values[0])
  //       return res.send({
  //         type: InteractionResponseType.UPDATE_MESSAGE,
  //         data: {
  //           content: 'Please fill out the form below to host a run.',
  //           components: [
  //             {
  //               type: 1,
  //               components: [
  //                 HostCommandSelectEventChannel
  //               ]
  //             }
  //           ]
  //         }
  //       })
  //     case "host_command_3":
  //       userSelectedValues[previousMessageId].push(values[0])
  //       return res.send({
  //         type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE,
  //         data: {
  //           content: 'Please fill out the form below to host a run.',
  //           components: [
  //             {
  //               type: 1,
  //               components: [
  //                 HostCommandSelectEventChannel
  //               ]
  //             }
  //           ]
  //         }
  //       })
  //   }
  // }

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
