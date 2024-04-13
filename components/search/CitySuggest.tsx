import { City } from '@prisma/client';

import { useEffect, useMemo, useState } from 'react';
import { CloseButton, Combobox, ComboboxItem, Loader, TextInput, useCombobox } from '@mantine/core';
import { getCity, getSuggestedCities } from '@/data/city';
import { useDidUpdate } from '@mantine/hooks';

interface CitySuggestProps {
	initialCityId?: number;
	onSelect: (city: City | null) => void;
	placeholder?: string;
	allowMultipleSelection?: boolean;
	queryMapsAPI?: boolean;
}

const stringifyCity = ({ name, region, country }: City) =>
	[name, region, country].filter((partOfAddress) => partOfAddress).join(', ');

// TODO: implement the features associated with the other props
export function CitySuggest({
	initialCityId,
	onSelect,
	placeholder = 'Search cities',
	allowMultipleSelection,
	queryMapsAPI,
}: CitySuggestProps) {
	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});

	const [suggestedCities, setSuggestedCities] = useState<City[]>([]);
	const [selectedCity, setSelectedCity] = useState<City | null>(null);

	const [loading, setLoading] = useState<boolean>(false);
	const [selectData, setSelectData] = useState<ComboboxItem[]>([]);
	const [cityQuery, setCityQuery] = useState<string>('');

	useEffect(() => {
		async function fetchInitialCity() {
			if (!initialCityId) {
				return;
			}
			const city = await getCity(initialCityId);
			if (city) {
				setSelectedCity(city);
				setCityQuery(stringifyCity(city));
			}
		}

		fetchInitialCity();
	}, []);

	useDidUpdate(() => {
		onSelect(selectedCity);
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

		if (selectedCity) {
			if (cityQuery === stringifyCity(selectedCity)) {
				return;
			} else {
				setSelectedCity(null);
			}
		}

		suggestCities();
	}, [cityQuery]);

	const suggstedCityOptions = useMemo(
		() =>
			(selectData || []).map((comboboxItem, index) => (
				<Combobox.Option value={comboboxItem.value} key={index}>
					{comboboxItem.label}
				</Combobox.Option>
			)),
		[selectData]
	);

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
					placeholder={placeholder}
					value={cityQuery}
					onChange={(event) => {
						setCityQuery(event.currentTarget.value);
						combobox.resetSelectedOption();
						combobox.openDropdown();
					}}
					onClick={() => combobox.openDropdown()}
					onFocus={() => combobox.openDropdown()}
					onBlur={() => combobox.closeDropdown()}
					rightSection={
						loading ? (
							<Loader size={18} />
						) : (
							cityQuery !== '' && (
								<CloseButton
									size="sm"
									onMouseDown={(event) => event.preventDefault()}
									onClick={() => setCityQuery('')}
								/>
							)
						)
					}
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
