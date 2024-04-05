import { FlatList, ScrollView, StyleSheet, Text, TextInput ,TouchableOpacity, View} from "react-native";
import React from 'react'
import { IconButton } from 'react-native-paper'
import { useState, useEffect } from "react";
import Fallback from "../components/Fallback";
import AsyncStorage from '@react-native-async-storage/async-storage';

const TodoScreen = () => {
    // Init local states
    const [todo, setTodo] = useState("");
    const [todoList, setTodoList] = useState([])
    const [editedTodo, setEditedTodo] = useState(null);

    // Load todo list from AsyncStorage when the component mounts
    useEffect(() => {
        const loadTodoList = async () => {
            try {
                const storedTodoList = await AsyncStorage.getItem('todoList');
                if (storedTodoList !== null) {
                    setTodoList(JSON.parse(storedTodoList));
                }
            } catch (error) {
                console.error(`Can't loading todo list from AsyncStorage:`, error);
            }
        };
        loadTodoList();
    }, []);

    // Save todo list to AsyncStorage whenever it changes
    useEffect(() => {
        const saveTodoList = async () => {
            try {
                await AsyncStorage.setItem('todoList', JSON.stringify(todoList));
            } catch (error) {
                console.error(`Can't saving todo list to AsyncStorage:`, error);
            }
        };
        saveTodoList();
    }, [todoList]);

    // Handle add todo
    const handleAddTodo = () => {
        if(todo === "") {
            alert("You shouldn't add empty task")
            return;
        }

        setTodoList([...todoList, { id: Date.now().toString(), title: todo }]);
        setTodo("");
    }

    // Handle edit todo
    const handleEditTodo = (todo) => {
        setEditedTodo(todo)
        setTodo(todo.title)
    }

    //Handle delete todo
    const handleDeleteTodo = (id) => {
        const updatedTodoList = todoList.filter((todo) => todo.id !== id)
        setTodoList(updatedTodoList);
    }

    // Handle update todo

    const handleUpdateTodo = () => {
        const updatedTodos = todoList.map((item) => {
            if (item.id === editedTodo.id){
                return { ...item, title: todo }
            }

            return item


        });
        setTodoList(updatedTodos);
        setEditedTodo(null);
        setTodo("");
    }

    // Render todo
    const renderTodo = ({ item }) => {
        return (
            <View 
                style={{
                    backgroundColor: "#1e90ff", 
                    borderRadius: 6, 
                    paddingHorizontal: 6, 
                    paddingVertical: 8, 
                    marginBottom: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "black",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8
                }}
            >
                
                <Text style={{ color: "white", fontSize: 20, fontWeight: "800", flex: 1}}>
                    {item.title}
                </Text>
                <IconButton 
                    icon="pencil" 
                    iconColor="white"
                    onPress={() => handleEditTodo(item)}
                />
                <IconButton 
                    icon="trash-can" 
                    iconColor="white" 
                    onPress = {() => handleDeleteTodo(item.id)}
                />
            </View>
        )
    }

    return (
        <View style={{ marginHorizontal: 16 }}>
            <TextInput 
                style={{ borderWidth: 3, 
                    borderColor: "#1e90ff", 
                    borderRadius: 6, 
                    paddingVertical: 8, 
                    paddingHorizontal: 16,
                    marginTop: 40,
                }}
                placeholder="Add a task"
                value={todo}
                onChangeText={(userText) => setTodo(userText)}
            />
        
            {editedTodo ? (
            <TouchableOpacity 
                style={{ 
                    backgroundColor: "black", 
                    borderRadius: 6, 
                    paddingVertical: 18,
                    marginVertical: 34,
                    alignItems: "center",
                }}
                onPress={() => handleUpdateTodo()}
            >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
                    Save
                </Text>
            </TouchableOpacity> 
            ) : (
            <TouchableOpacity 
            style={{ 
                    backgroundColor: "black", 
                    borderRadius: 6, 
                    paddingVertical: 18,
                    marginVertical: 34,
                    alignItems: "center",
                }}
                onPress={() => handleAddTodo()}
            >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
                    Add
                </Text>
            </TouchableOpacity>
        )}
            <FlatList 
                data = {todoList} 
                renderItem={renderTodo}
                keyExtractor={(item) => item.id}
                style={{ flexGrow: 1 }}
            />
            {todoList.length <= 0 && <Fallback />}
        </View>
    )
};

export default TodoScreen
const styles = StyleSheet.create({})