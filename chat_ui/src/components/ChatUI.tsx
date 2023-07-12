import * as React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const api = process.env.REACT_APP_API

const questions = [
  "Which of the following descriptions accurately describes Azure Machine Learning? 1 - A Python library that you can use as an alternative to common machine learning frameworks like Scikit-Learn, PyTorch, and Tensorflow. 2 - An application for Microsoft Windows that enables you to create machine learning models by using a drag and drop interface. 3 - A cloud-based platform for operating machine learning solutions at scale.",
  "Which edition of Azure Machine Learning workspace should you provision if you only plan to use the graphical Designer tool to train machine learning models - Enterprise or Basic?",
  "You need a cloud-based development environment that you can use to run Jupyter notebooks that are stored in your workspace. The notebooks must remain in your workspace at all times. 1 - Install Visual Studio Code on your local computer. 2 - Create a Compute Instance compute target in your workspace. 3 - Create a Training Cluster compute target in your workspace.",
];

const ChatUI = () => {
  const [input, setInput] = React.useState("");
  const [isQuestionaryStarted, setIsQuestionaryStarted] = React.useState(false);
  const [isToSend, setIsToSend] = React.useState(false);
  const [isWaitingForCV, setIsWaitingForCV] = React.useState(false)
  const [isFinished, setIsFinished] = React.useState(false);
  const previousInputValue = React.useRef({ isToSend, input });
  const [messages, setMessages] = React.useState([
    { id: 1, text: "Hi there.\nI am a bot and i would like to make assessment of your knowledge.\nAre you ready?", sender: "bot" }
  ]);

  React.useEffect(() => {
    if (previousInputValue.current.input === "" || isToSend === false) {
      setIsToSend(false);
      return;
    }
    if (isWaitingForCV === true) {
      setIsFinished(true);
      messages.push({
        id: 0,
        text: "Thank you for your responses!",
        sender: "bot"
      });
      setMessages(messages);
      return;
    }
    let [second_to_last_message, last_message] = messages.slice(-2);
    fetch(api + '/message?data=' + second_to_last_message["text"] +  last_message["text"])
       .then((response) => response.json())
       .then((data) => {
          messages.push({
            id: 0,
            text: data,
            sender: "bot"
          });
          const question = questions.shift() || "";
          if (question === "") {
            messages.push({
              id: 0,
              text: "Please, send a CV of yours.",
              sender: "bot"
            });
            setIsWaitingForCV(true);
          } else {
            messages.push({
              id: 0,
              text: question,
              sender: "bot"
            });
          }

          setMessages(messages);
       })
       .catch((err) => {
          console.log(err.message);
       })
       .finally(() => {
          setIsToSend(false);
       });
    }, [isToSend]);

  const handleSend = () => {
    if (input.trim() === "") {
      return;
    }

    setInput("");
    
    messages.push({
      id: 0,
      text: input,
      sender: "user"
    });

    if (isQuestionaryStarted === false) {
      messages.push({
        id: 0,
        text: "Ok, let us start!",
        sender: "bot"
      });
      const question = questions.shift() || "";
      messages.push({
        id: 0,
        text: question,
        sender: "bot"
      });
      setMessages(messages);
      setIsQuestionaryStarted(true);
      return;
    }

    setMessages(messages);
    setIsToSend(true);
    previousInputValue.current.input = input;
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <Box
      sx={{
        height: "92vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "grey.200",
        paddingBottom: "-300px"
      }}
    >
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </Box>
      <Box sx={{ p: 2, backgroundColor: "background.default" }}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            
          <TextField
              fullWidth
              id="message"
              label="Type a message"
              variant="outlined" 
              value={input}
              onChange={handleInputChange}
              disabled={isFinished}/>
          </Grid>
          <Grid item xs={2} style={{display:'grid',placeContent:"center"}} >
            <Button
              fullWidth
              size="large"
              color="primary"
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSend}
              disabled={isFinished}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const Message = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isBot ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isBot ? "row" : "row-reverse",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ bgcolor: isBot ? "primary.main" : "secondary.main" }}>
          {isBot ? "B" : "U"}
        </Avatar>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            ml: isBot ? 1 : 0,
            mr: isBot ? 0 : 1,
            backgroundColor: isBot ? "primary.light" : "secondary.light",
            borderRadius: isBot ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
          }}
        >
          <Typography variant="body1">{message.text}</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatUI;
