import { OrderFilter } from '@/type';
import { useColorScheme, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

// Filter options
const filters: OrderFilter[] = [
  { label: "All", value: '' },
  { label: "Pending", value: "pending" },
  { label: "Preparing", value: "preparing" },
  { label: "On the way", value: "on the way" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

// Filter Dropdown Component
const FilterDropdown = ({ value, setValue }: { 
  value: string; 
  setValue: (value: string) => void; 
}) => {
  const colorScheme = useColorScheme();
  
  return (
    <View className="mx-4 mb-4">
      <View className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-neutral-700">
        <Dropdown
          data={filters}
          labelField="label"
          valueField="value"
          placeholder="Filter by status"
          placeholderStyle={{ 
            color: colorScheme === "dark" ? "#9CA3AF" : "#6B7280",
            fontSize: 16
          }}
          selectedTextStyle={{ 
            color: colorScheme === "dark" ? "#FFFFFF" : "#1F2937",
            fontSize: 16
          }}
          containerStyle={{
            backgroundColor: colorScheme === "dark" ? "#262626" : "#FFFFFF",
            borderRadius: 16,
            borderWidth: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          itemTextStyle={{ 
            color: colorScheme === "dark" ? "#FFFFFF" : "#1F2937",
            fontSize: 16
          }}
          value={value}
          onChange={(item) => setValue(item.value)}
          activeColor={colorScheme === "dark" ? "#404040" : "#F3F4F6"}
          search
          searchPlaceholder="Search filters..."
          inputSearchStyle={{
            borderRadius: 12,   
            backgroundColor: colorScheme === "dark" ? "#404040" : "#F9FAFB",
            paddingHorizontal: 12,
            color: colorScheme === "dark" ? "#FFFFFF" : "#1F2937",
            fontSize: 16,
          }}
        />
      </View>
    </View>
  );
};

export default FilterDropdown;