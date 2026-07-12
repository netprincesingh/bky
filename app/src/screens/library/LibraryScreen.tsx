import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetBooksQuery, useGetArticlesQuery, Book, Article } from '../../api/LibraryContentApi';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  
  // Using RTK Query Hooks!
  const { data: books = [], isLoading: isBooksLoading, isError: isBooksError } = useGetBooksQuery();
  const { data: articles = [], isLoading: isArticlesLoading, isError: isArticlesError } = useGetArticlesQuery();

  const loading = isBooksLoading || isArticlesLoading;
  const error = isBooksError || isArticlesError;

  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardImagePlaceholder}>
        <Text style={styles.imageText}>Book Cover</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.language}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderArticleItem = ({ item }: { item: Article }) => (
    <TouchableOpacity style={[styles.card, styles.articleCard]}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.language}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={{ color: 'red' }}>Failed to load library data.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.headerTitle}>Library</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spiritual Classics</Text>
        {books.length === 0 ? (
          <Text style={styles.emptyText}>No books available.</Text>
        ) : (
          <FlatList
            horizontal
            data={books}
            keyExtractor={(item) => item.id}
            renderItem={renderBookItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Articles</Text>
        {articles.length === 0 ? (
          <Text style={styles.emptyText}>No articles available.</Text>
        ) : (
          <FlatList
            horizontal
            data={articles}
            keyExtractor={(item) => item.id}
            renderItem={renderArticleItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    color: '#1A1A1A',
  },
  section: {
    marginBottom: 35,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 15,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  card: {
    width: 140,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4, 
    overflow: 'hidden',
  },
  articleCard: {
    width: 220,
    minHeight: 120,
    justifyContent: 'center',
  },
  cardImagePlaceholder: {
    height: 180,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: '#A0A0A0',
    fontSize: 12,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
    lineHeight: 20,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#888',
  },
  emptyText: {
    paddingHorizontal: 20,
    color: '#888',
    fontStyle: 'italic',
  }
});
