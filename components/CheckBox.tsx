import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type CheckboxProps = {
    checked: boolean;
    size: number;
    checkedColor: string;
    onChange: (value: boolean) => void;
}

export default function Checkbox({ checked, onChange, size, checkedColor }: CheckboxProps) {
  return (
    <TouchableOpacity onPress={() => onChange(!checked)} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <MaterialIcons
        name={checked ? 'check-box' : 'check-box-outline-blank'}
        size={size}
        color={checked ? checkedColor : 'gray'}
      />
    </TouchableOpacity>
  );
}