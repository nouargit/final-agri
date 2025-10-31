import { Search, X } from "lucide-react-native";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

// Search Bar Component
const SearchBar = ({ searchQuery, setSearchQuery }: { 
  searchQuery: string; 
  setSearchQuery: (query: string) => void; 
}) => (
  <View className="flex-row items-center bg-white dark:bg-neutral-800 rounded-2xl px-4 py-1 mx-4 mb-4 shadow-sm border border-gray-100 dark:border-neutral-700">
    <Search size={20} color="#9CA3AF" />
    <TextInput
      className="flex-1 ml-3 text-gray-900 dark:text-white text-base"
      placeholder="Search orders..."
      placeholderTextColor="#9CA3AF"
      value={searchQuery}
      onChangeText={setSearchQuery}
    />
    {searchQuery !== '' && (
      <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2">
        <X size={20} color="#9CA3AF" />
      </TouchableOpacity>
    )}
  </View>
);

export default SearchBar;