import { City } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue, useDidUpdate } from '@mantine/hooks';
import { CloseButton, Combobox, Loader, TextInput, useCombobox } from '@mantine/core';

import { getCity, getSuggestedCities } from '@/data/city';

import { stringifyCity } from '../util';

interface CitySuggestProps {
	initialCityId?: string;
	onSelect: (city: City | null) => void;
	placeholder?: string;
	allowMultipleSelection?: boolean;
	queryMapsAPI?: boolean;
}

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

	const [cityQuery, setCityQuery] = useState<string>('');
	const [selectedCity, setSelectedCity] = useState<City | null>(null);

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
		if (selectedCity) {
			if (cityQuery === stringifyCity(selectedCity)) {
				return;
			} else {
				setSelectedCity(null);
			}
		}
	}, [cityQuery]);

	const [debouncedCityQuery] = useDebouncedValue(cityQuery, 100, { leading: true });
	const {
		data: { suggestedCities, cityOptionElements },
		isLoading,
	} = useQuery<{ suggestedCities: City[]; cityOptionElements: JSX.Element[] }>({
		queryKey: ['cities', debouncedCityQuery],
		initialData: { suggestedCities: [], cityOptionElements: [] },
		queryFn: async () => {
			const suggestedCities = await getSuggestedCities(debouncedCityQuery);
			// TODO: group based on if it's an existing city or not
			const cityOptionElements = suggestedCities.map((city) => (
				<Combobox.Option value={city.id} key={city.id}>
					{stringifyCity(city)}
				</Combobox.Option>
			));
			return { suggestedCities, cityOptionElements };
		},
	});

	return (
		<Combobox
			onOptionSubmit={(cityId) => {
				const city = suggestedCities.find((city) => city.id === cityId)!;
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
						isLoading ? (
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

			<Combobox.Dropdown>
				<Combobox.Options>
					{cityOptionElements}
					{suggestedCities.length === 0 && <Combobox.Empty>No cities match search</Combobox.Empty>}
				</Combobox.Options>
			</Combobox.Dropdown>
		</Combobox>
	);
}
