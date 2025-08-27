import React, { useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import axios from 'axios';

const backendURL = 'http://your_ip_address:5000'; // 🔁 Replace with your machine's local IP

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { type: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const res = await axios.post(`${backendURL}/chat`, { text: userMessage.text }); // ✅ Corrected endpoint
      const botReply = res.data?.text || "🤖 Sorry, no response.";
      setMessages(prev => [...prev, { type: 'bot', text: botReply }]);
    } catch (error) {
      console.error('API error:', error);
      setMessages(prev => [...prev, { type: 'bot', text: '⚠️ Error contacting server.' }]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={[styles.card, item.type === 'user' ? styles.userCard : styles.botCard]}>
      <Card.Content>
        <Text>{item.text}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 10 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Type your question"
          value={inputText}
          onChangeText={setInputText}
        />
        <Button mode="contained" onPress={sendMessage} loading={loading} disabled={loading} style={styles.button}>
          Send
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
  },
  button: {
    borderRadius: 10,
  },
  card: {
    marginVertical: 4,
    padding: 10,
  },
  userCard: {
    backgroundColor: '#dff9fb',
    alignSelf: 'flex-end',
  },
  botCard: {
    backgroundColor: '#f6e58d',
    alignSelf: 'flex-start',
  },
});
