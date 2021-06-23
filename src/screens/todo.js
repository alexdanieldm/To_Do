import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, Keyboard, FlatList } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import TodoInput from '../components/todoInput';
import Filter from '../components/filter';
import Row from '../components/row';
import Loading from '../components/loading';

import itemsFilter from '../utils/itemsFilter';

const Todo = () => {
	const [ loading, setLoading ] = useState(false);
	const [ inputValue, setInputValue ] = useState('');
	const [ filter, setFilter ] = useState('ALL');
	const [ todoItems, setTodoItems ] = useState([]);
	const [ filterItems, setFilterItems ] = useState([]);

	useEffect(() => {
		setLoading(true);
		AsyncStorage.getItem('items').then((json) => {
			try {
				// TODO : Move from AsyncStorage to Firebase DB

				const parseJSON = JSON.parse(json);
				setTodoItems(parseJSON);
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
			}
		});
	}, []);

	useEffect(
		async () => {
			const updatedItems = await itemsFilter(filter, todoItems);
			setFilterItems(updatedItems);

			AsyncStorage.setItem('items', JSON.stringify(todoItems));
		},
		[ todoItems ]
	);

	const handleAddToDoItem = () => {
		if (!inputValue) {
			return;
		}

		setTodoItems((currentTodoItems) => {
			return [
				...currentTodoItems,
				{
					key: Date.now(),
					text: inputValue,
					complete: false
				}
			];
		});

		setInputValue('');
	};

	const handleToggleCompleteAllItems = () => {
		const itsAllComplete = todoItems.every((item) => item.complete === true);

		setTodoItems((currentTodoItems) => {
			const newTodoItem = [ ...todoItems ];

			newTodoItem.map((item) => {
				currentTodoItems;
				item.complete = !itsAllComplete;
			});

			return newTodoItem;
		});
		setFilterItems(itemsFilter(filter, todoItems));
	};

	const handleToggleCompleteItem = (key, complete) => {
		const targetTodoItemIndex = todoItems.findIndex((todoItem) => todoItem.key === key);
		const targetTodoItem = todoItems[targetTodoItemIndex];
		const newTodoItem = { ...targetTodoItem, complete };

		setTodoItems((currentTodoItems) => {
			return [
				...currentTodoItems.slice(0, targetTodoItemIndex),
				newTodoItem,
				...currentTodoItems.slice(targetTodoItemIndex + 1)
			];
		});
	};

	const handleRemoveToDoItem = (key) => {
		const targetTodoItemIndex = todoItems.findIndex((todoItem) => todoItem.key === key);

		setTodoItems((currentTodoItems) => {
			return [
				...currentTodoItems.slice(0, targetTodoItemIndex),
				...currentTodoItems.slice(targetTodoItemIndex + 1)
			];
		});
	};

	const handleToggleEditing = (key, editing) => {
		const targetTodoItemIndex = todoItems.findIndex((todoItem) => todoItem.key === key);
		const targetTodoItem = todoItems[targetTodoItemIndex];
		const newTodoItem = { ...targetTodoItem, editing };

		setTodoItems((currentTodoItems) => {
			return [
				...currentTodoItems.slice(0, targetTodoItemIndex),
				newTodoItem,
				...currentTodoItems.slice(targetTodoItemIndex + 1)
			];
		});
	};

	const handleUpdateTodoItem = (key, text) => {
		const targetTodoItemIndex = todoItems.findIndex((todoItem) => todoItem.key === key);
		const targetTodoItem = todoItems[targetTodoItemIndex];
		const newTodoItem = { ...targetTodoItem, text };

		setTodoItems((currentTodoItems) => {
			return [
				...currentTodoItems.slice(0, targetTodoItemIndex),
				newTodoItem,
				...currentTodoItems.slice(targetTodoItemIndex + 1)
			];
		});
	};

	const handleFilter = (filter) => {
		setFilter(filter);

		setFilterItems(itemsFilter(filter, todoItems));
	};

	const handleDeleteAllCompleted = () => {
		const incompletedTodoItems = todoItems.filter(({ complete }) => complete === false);
		setTodoItems(incompletedTodoItems);
	};

	return (
		<View style={styles.container}>
			<TodoInput
				value={inputValue}
				onAddItem={handleAddToDoItem}
				onChange={(value) => setInputValue(value)}
				onToggleAllComplete={handleToggleCompleteAllItems}
			/>

			<View style={styles.content}>
				<FlatList
					style={styles.list}
					data={filterItems}
					extraData={todoItems}
					onScroll={() => Keyboard.dismiss()}
					renderItem={({ item }) => {
						return (
							<Row
								key={item.key}
								onComplete={(complete) => handleToggleCompleteItem(item.key, complete)}
								onRemove={() => handleRemoveToDoItem(item.key)}
								onToggleEdit={(editing) => handleToggleEditing(item.key, editing)}
								onUpdate={(text) => handleUpdateTodoItem(item.key, text)}
								{...item}
							/>
						);
					}}
					ItemSeparatorComponent={(rowId) => {
						return <View key={rowId} style={styles.separator} />;
					}}
				/>
			</View>

			<Filter
				count={itemsFilter('ACTIVE', todoItems).length}
				onFilter={handleFilter}
				filter={filter}
				onClearComplete={handleDeleteAllCompleted}
			/>

			<Loading loading={loading} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F5F5',
		...Platform.select({
			ios: { paddingTop: 30 }
		})
	},

	content: {
		flex: 1
	},

	list: {
		backgroundColor: '#FFF'
	},

	separator: {
		borderWidth: 1,
		borderColor: '#F5F5F5'
	}
});

export default Todo;
