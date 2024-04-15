import { useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "../../hooks/useAppwrite";
import EmptyState from "../../components/EmptyState";
import SearchInput from "../../components/SearchInput";
import { searchPosts } from "../../lib/appwrite";
import VideoCard, { VideoProps } from "../../components/VideoCard";
import { useLocalSearchParams } from "expo-router";
import Loader from "../../components/Loader";

const Search = () => {
  const { query } = useLocalSearchParams<{ query: string }>();
  const {
    data: posts,
    isLoading,
    refetch,
    // @ts-ignore
  } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={isLoading} />

      {!isLoading && (
        <FlatList
          data={posts as (VideoProps & { $id: string })[]}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <VideoCard video={item} />}
          ListHeaderComponent={() => (
            <View className="my-6 px-4 space-y-6">
              <Text className="font-pmedium text-sm text-gray-100">
                Search Results
              </Text>
              <Text className="text-2xl font-psemibold text-white">
                {query}
              </Text>
              <View className="mt-6 mb-8">
                <SearchInput initialQuery={query} />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Videos Found"
              subtitle="No videos found for this search query"
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Search;
