import { Dispatch, SetStateAction, useEffect } from 'react';
import Script from 'next/script';
import { Notification, Text, TextInput } from '@mantine/core';
import { IconCheck, IconHome } from '@tabler/icons-react';

import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';

type HandleSelect = {
  description: string;
};

// Google Places API
type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type PageProps = {
  selectedAddress: AddressComponent[];
  setSelectedAddress: Dispatch<SetStateAction<AddressComponent[]>>;
};

export default function AddressFinder({
  selectedAddress,
  setSelectedAddress,
}: PageProps) {
  const {
    ready,
    value: address,
    suggestions: { status, data },
    setValue: setAddress,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: 'initMap',
    requestOptions: {
      /* Define search scope here */
      componentRestrictions: { country: 'nz' },
      country: 'nz',
    },
    //debounce: 300, delay in suggestions showing
  });
  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });

  const handleInput = (value: string) => {
    setAddress(value); // Update the keyword of the input element
  };

  const handleSelect =
    ({ description }: HandleSelect) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setAddress(description, false);
      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({
        address: description,
        componentRestrictions: {
          country: 'NZ',
        },
      }).then((results) => {
        // set address with postcode included, and remove "New Zealand"

        setSelectedAddress(results[0].address_components);

        // old
        /*setSelectedAddress(
          results[0].formatted_address.slice(
            0,
            results[0].formatted_address.lastIndexOf(',')
          )
        ); */
      });
    };

  const renderSuggestions = () => {
    const filteredSuggestions = data.filter((suggestion) =>
      suggestion.description.includes('New Zealand')
    );

    // return data.map((suggestion) => {
    //return filteredSuggestions.map((suggestion) => {
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      const location = secondary_text.slice(0, secondary_text.lastIndexOf(','));

      return (
        <li
          key={place_id}
          onClick={handleSelect(suggestion)}
          className="p-3 hover:bg-blue-50 transition cursor-pointer"
        >
          <strong>{main_text}</strong> {secondary_text}
        </li>
      );
    });
  };

  function resetSelectedAddress() {
    setAddress('');
    setSelectedAddress([]);
  }

  function formatAddress(address: string) {
    const formattedAddress = address.split(',').join('\n');

    return formattedAddress;
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places&callback=initMap&region=NZ`}
        // strategy="beforeInteractive"
      />
      <div ref={ref} className="space-y-3">
        <TextInput
          type="text"
          label="Address"
          placeholder="Your address e.g. 32 Main Street, Suburb, Town/City"
          icon={<IconHome size={20} />}
          size="md"
          value={address}
          onChange={(e) => handleInput(e.target.value)}
          disabled={!!selectedAddress.length}
          required
        />

        {status === 'OK' && <ul>{renderSuggestions()}</ul>}

        {!!selectedAddress.length && (
          <Notification
            icon={<IconCheck size={18} />}
            color="teal"
            onClose={resetSelectedAddress}
          >
            <Text className="whitespace-pre-line">
              {selectedAddress[0].long_name +
                ' ' +
                selectedAddress[1].long_name}
              <br />
              {selectedAddress[2].long_name}
              <br />
              {selectedAddress[3].long_name +
                ' ' +
                selectedAddress[6].long_name}
            </Text>
          </Notification>
        )}
      </div>
    </>
  );
}
