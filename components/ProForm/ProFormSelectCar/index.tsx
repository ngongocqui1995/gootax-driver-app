import { useAsyncEffect, useSetState } from "ahooks";
import to from "await-to-js";
import { FormControl, Input, Select, VStack } from "native-base";
import { InterfaceSelectProps } from "native-base/lib/typescript/components/primitives/Select/types";
import { queryCars } from "../../../services/car";

interface ProFormSelectCarProps {
  errorText?: string;
  fieldProps?: InterfaceSelectProps;
}

const ProFormSelectCar: React.FC<ProFormSelectCarProps> = (props) => {
  const [state, setState] = useSetState<{
    data: any[];
    car: string;
    company: string;
    type_car: string;
  }>({
    data: [],
    car: "",
    company: "",
    type_car: "",
  });

  useAsyncEffect(async () => {
    const [err, res]: any = await to(queryCars());
    if (err) return;
    setState({ data: res?.data || [] });
  }, []);

  return (
    <VStack space={3}>
      <FormControl isRequired isInvalid={!!props.errorText}>
        <FormControl.Label>Xe</FormControl.Label>
        <Select
          placeholder="Chọn xe"
          {...props.fieldProps}
          onValueChange={(item) => {
            const findItem = state.data.find((it) => it.id === item);
            setState({
              car: item,
              company: findItem?.company?.name || "",
              type_car: findItem?.type_car?.name || "",
            });
            props.onValueChange?.(item);
          }}
        >
          {state.data?.map((item: any) => (
            <Select.Item key={item.id} label={item.name} value={item.id} />
          ))}
        </Select>
        <FormControl.ErrorMessage>{props.errorText}</FormControl.ErrorMessage>
      </FormControl>
      {state.car && (
        <VStack space={3}>
          <FormControl isDisabled>
            <FormControl.Label>Hãng xe</FormControl.Label>
            <Input value={state.company} />
          </FormControl>
          <FormControl isDisabled>
            <FormControl.Label>Loại xe</FormControl.Label>
            <Input value={state.type_car} />
          </FormControl>
        </VStack>
      )}
    </VStack>
  );
};

export default ProFormSelectCar;
