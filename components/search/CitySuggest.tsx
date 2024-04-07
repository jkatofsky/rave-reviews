import { City } from '@prisma/client';

import { useState } from 'react';
import { Combobox, ComboboxItem, Loader, TextInput, useCombobox } from '@mantine/core';
import { getSuggestedCities } from '@/data/city';
import { useDidUpdate } from '@mantine/hooks';

interface CitySuggestProps {
	onSelect: (city: City) => void;
	allowMultipleSelection?: boolean;
	queryMapsAPI?: boolean;
}

const stringifyCity = ({ name, region, country }: City) => `${name}, ${region}, ${country}`;

// TODO: implement the features associated with the other props
export function CitySuggest({ onSelect, allowMultipleSelection, queryMapsAPI }: CitySuggestProps) {
	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});

	const [suggestedCities, setSuggestedCities] = useState<City[]>([]);
	const [selectedCity, setSelectedCity] = useState<City | null>(null);

	const [loading, setLoading] = useState<boolean>(false);
	const [selectData, setSelectData] = useState<ComboboxItem[]>([]);
	const [cityQuery, setCityQuery] = useState<string>('');

	useDidUpdate(() => {
		if (selectedCity) {
			onSelect(selectedCity);
		}
	}, [selectedCity]);

	useDidUpdate(() => {
		async function suggestCities() {
			setLoading(true);

			const cities = await getSuggestedCities(cityQuery);
			setSuggestedCities(cities);
			// TODO: groups based on if it is a new city or not
			setSelectData(
				cities.map((city) => ({
					value: city.id.toString(),
					label: stringifyCity(city),
				}))
			);

			setLoading(false);
		}

		if (selectedCity && cityQuery === stringifyCity(selectedCity)) {
			return;
		}

		suggestCities();
	}, [cityQuery]);

	const suggstedCityOptions = (selectData || []).map((comboboxItem, index) => (
		<Combobox.Option value={comboboxItem.value} key={index}>
			{comboboxItem.label}
		</Combobox.Option>
	));

	return (
		<Combobox
			onOptionSubmit={(cityId) => {
				const city = suggestedCities.find((city) => city.id === parseInt(cityId))!;
				setCityQuery(stringifyCity(city));
				setSelectedCity(city);
				combobox.closeDropdown();
			}}
			withinPortal={false}
			store={combobox}
		>
			<Combobox.Target>
				<TextInput
					placeholder="Search cities"
					value={cityQuery}
					onChange={(event) => {
						setCityQuery(event.currentTarget.value);
						combobox.resetSelectedOption();
						combobox.openDropdown();
					}}
					onClick={() => combobox.openDropdown()}
					onFocus={() => combobox.openDropdown()}
					onBlur={() => combobox.closeDropdown()}
					rightSection={loading && <Loader size={18} />}
				/>
			</Combobox.Target>

			<Combobox.Dropdown hidden={selectData === null}>
				<Combobox.Options>
					{suggstedCityOptions}
					{suggestedCities.length === 0 && <Combobox.Empty>No cities match search</Combobox.Empty>}
				</Combobox.Options>
			</Combobox.Dropdown>
		</Combobox>
	);
}
