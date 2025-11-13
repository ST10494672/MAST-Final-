// App.tsx — Fully Functional, No Placeholders, Ready for PoE
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';

// Define MenuItem type
type MenuItem = {
  id: string;
  dishName: string;
  description: string;
  course: string;
  price: string;
  image: string;
};

// Predefined courses
const COURSES = ['Starters', 'Mains', 'Dessert'];

export default function App() {
  // Main menu state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
  // View state
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'filter'>('home');
  
  // Filter state
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  
  // Admin form state
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starters');
  const [price, setPrice] = useState('');

  // Add new menu item
  const handleAddMenuItem = () => {
    if (!dishName.trim() || !description.trim() || !price.trim()) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'Please enter a valid price (e.g., 129).');
      return;
    }

    const newItem: MenuItem = {
      id: `custom-${Date.now()}`,
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: price.trim(),
      image: 'https://cdn-icons-png.flaticon.com/512/3075/3075715.png',
    };

    setMenuItems(prev => [...prev, newItem]);
    
    // Reset form
    setDishName('');
    setDescription('');
    setPrice('');
    setCourse('Starters');
  };

  // Remove menu item
  const handleRemoveItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  // === STATS CALCULATION ===
  const totalItems = menuItems.length;

  const courseStats = {
    Starters: { count: 0, total: 0 },
    Mains: { count: 0, total: 0 },
    Dessert: { count: 0, total: 0 },
  };

  menuItems.forEach(item => {
    const price = parseFloat(item.price) || 0;
    if (courseStats[item.course as keyof typeof courseStats]) {
      courseStats[item.course as keyof typeof courseStats].count++;
      courseStats[item.course as keyof typeof courseStats].total += price;
    }
  });

  const avgPricePerCourse = {
    Starters: courseStats.Starters.count > 0 ? (courseStats.Starters.total / courseStats.Starters.count).toFixed(2) : '0.00',
    Mains: courseStats.Mains.count > 0 ? (courseStats.Mains.total / courseStats.Mains.count).toFixed(2) : '0.00',
    Dessert: courseStats.Dessert.count > 0 ? (courseStats.Dessert.total / courseStats.Dessert.count).toFixed(2) : '0.00',
  };

  // === FILTERED ITEMS ===
  const filteredItems = selectedCourse
    ? menuItems.filter(item => item.course === selectedCourse)
    : menuItems;

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />

      {/* View Switcher */}
      <View style={styles.viewButtons}>
        <Button
          title="Home"
          color={currentView === 'home' ? '#007AFF' : '#888'}
          onPress={() => setCurrentView('home')}
        />
        <Button
          title="Admin"
          color={currentView === 'admin' ? '#007AFF' : '#888'}
          onPress={() => setCurrentView('admin')}
        />
        <Button
          title="Filter"
          color={currentView === 'filter' ? '#007AFF' : '#888'}
          onPress={() => setCurrentView('filter')}
        />
      </View>

      {/* ============== HOME VIEW ============== */}
      {currentView === 'home' && (
        <>
          <Text style={styles.title}>Christoffel's Menu</Text>

          <View style={styles.statsContainer}>
            <Text style={styles.stat}>Total Items: {totalItems}</Text>
            <Text style={styles.stat}>Avg Price - Starters: R{avgPricePerCourse.Starters}</Text>
            <Text style={styles.stat}>Avg Price - Mains: R{avgPricePerCourse.Mains}</Text>
            <Text style={styles.stat}>Avg Price - Dessert: R{avgPricePerCourse.Dessert}</Text>
          </View>

          {menuItems.length === 0 ? (
            <Text style={styles.empty}>No items yet. Add dishes in Admin!</Text>
          ) : (
            menuItems.map(item => (
              <View key={item.id} style={styles.item}>
                <Text style={styles.dishName}>{item.dishName}</Text>
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.course}>Course: {item.course}</Text>
                <Text style={styles.price}>Price: R{item.price}</Text>
              </View>
            ))
          )}
        </>
      )}

      {/* ============== ADMIN VIEW ============== */}
      {currentView === 'admin' && (
        <>
          <Text style={styles.title}>Chef Admin Panel</Text>

          <View style={styles.form}>
            <Text style={styles.formLabel}>Add New Dish</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Dish name"
              value={dishName}
              onChangeText={setDishName}
            />
            
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Description"
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
            
            <Text style={styles.formLabel}>Select Course:</Text>
            <View style={styles.courseButtons}>
              {COURSES.map((c) => (
                <Button
                  key={c}
                  title={c}
                  color={course === c ? '#007AFF' : '#888'}
                  onPress={() => setCourse(c)}
                />
              ))}
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Price (e.g., 129)"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
            
            <View style={styles.buttonContainer}>
              <Button
                title="Add to Menu"
                onPress={handleAddMenuItem}
                color="#007AFF"
              />
            </View>
          </View>

          {/* Current Menu with Remove */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Menu ({menuItems.length} items)</Text>
            {menuItems.length === 0 ? (
              <Text style={styles.empty}>No items added yet.</Text>
            ) : (
              menuItems.map(item => (
                <View key={item.id} style={styles.menuItem}>
                  <Text style={styles.dishName}>{item.dishName}</Text>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.course}>Course: {item.course}</Text>
                  <Text style={styles.price}>Price: R{item.price}</Text>
                  <View style={styles.buttonContainer}>
                    <Button
                      title="Remove"
                      onPress={() => handleRemoveItem(item.id)}
                      color="#DC3545"
                    />
                  </View>
                </View>
              ))
            )}
          </View>
        </>
      )}

      {/* ============== FILTER VIEW ============== */}
      {currentView === 'filter' && (
        <>
          <Text style={styles.title}>Filter Menu by Course</Text>

          <View style={styles.courseButtons}>
            {COURSES.map((c) => (
              <Button
                key={c}
                title={c}
                color={selectedCourse === c ? '#007AFF' : '#888'}
                onPress={() => setSelectedCourse(c)}
              />
            ))}
            <Button
              title="Show All"
              color={selectedCourse === null ? '#007AFF' : '#888'}
              onPress={() => setSelectedCourse(null)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {selectedCourse ? `${selectedCourse} Items` : `All Items (${menuItems.length})`}
            </Text>
            {filteredItems.length === 0 ? (
              <Text style={styles.empty}>
                No {selectedCourse ? selectedCourse.toLowerCase() : 'items'} found.
              </Text>
            ) : (
              filteredItems.map(item => (
                <View key={item.id} style={styles.menuItem}>
                  <Text style={styles.dishName}>{item.dishName}</Text>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.course}>Course: {item.course}</Text>
                  <Text style={styles.price}>Price: R{item.price}</Text>
                </View>
              ))
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  viewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statsContainer: {
    backgroundColor: '#e8f4fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  stat: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginVertical: 4,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontStyle: 'italic',
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
    textAlign: 'center',
  },
  image: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
    textAlign: 'center',
  },
  course: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28A745',
    textAlign: 'center',
  },
  form: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formLabel: {
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  descriptionInput: {
    height: 80,
  },
  courseButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 6,
  },
  buttonContainer: {
    marginTop: 10,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  menuItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
});