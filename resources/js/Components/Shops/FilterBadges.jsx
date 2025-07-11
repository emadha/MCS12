import React from 'react';
import { Tag } from 'antd';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FilterBadges({ filters, setFilters, types, predefinedLocations }) {
    if (!filters) return null;

    // Check if any filters are set
    const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
        return value && value !== '' && key !== 'rating_min' && key !== 'rating_max';
    }) || filters.rating_min > 0 || filters.rating_max < 5;

    if (!hasActiveFilters) return null;

    // Function to clear a specific filter
    const clearFilter = (filterKey, specificValue = null) => {
        if (specificValue !== null && filterKey === 'type' || filterKey === 'predefined_location') {
            // For multi-select filters, remove just the specific value
            const values = filters[filterKey].split(',');
            const newValues = values.filter(val => val !== specificValue.toString()).join(',');
            setFilters({
                ...filters,
                [filterKey]: newValues
            });
        } else if (filterKey === 'rating') {
            // Reset rating range
            setFilters({
                ...filters,
                rating_min: 0,
                rating_max: 5
            });
        } else {
            // Clear single value filters
            setFilters({
                ...filters,
                [filterKey]: ''
            });
        }
    };

    // Find name for type ID
    const getTypeName = (typeId) => {
        const type = types.find(t => t.id.toString() === typeId);
        return type ? type.title : typeId;
    };

    // Find name for location ID
    const getLocationName = (locationId) => {
        const location = predefinedLocations?.data?.find(l => l.id.toString() === locationId);
        return location ? location.name : locationId;
    };

    return (
        <div className="filter-badges flex flex-wrap gap-2 mb-5 mt-2">
            {/* Title filter */}
            {filters.title && (
                <Tag
                    color="blue"
                    closable
                    onClose={() => clearFilter('title')}
                    className="py-1 px-3 text-sm"
                >
                    Name: {filters.title}
                </Tag>
            )}

            {/* Location filter */}
            {filters.location && (
                <Tag
                    color="green"
                    closable
                    onClose={() => clearFilter('location')}
                    className="py-1 px-3 text-sm"
                >
                    Location: {filters.location}
                </Tag>
            )}

            {/* Type filter - can be multiple */}
            {filters.type && filters.type.split(',').map(typeId => (
                <Tag
                    key={`type-${typeId}`}
                    color="purple"
                    closable
                    onClose={() => clearFilter('type', typeId)}
                    className="py-1 px-3 text-sm"
                >
                    Type: {getTypeName(typeId)}
                </Tag>
            ))}

            {/* Predefined location filter - can be multiple */}
            {filters.predefined_location && filters.predefined_location.split(',').map(locationId => (
                <Tag
                    key={`location-${locationId}`}
                    color="cyan"
                    closable
                    onClose={() => clearFilter('predefined_location', locationId)}
                    className="py-1 px-3 text-sm"
                >
                    Area: {getLocationName(locationId)}
                </Tag>
            ))}

            {/* Contact method filter */}
            {filters.contact_method && (
                <Tag
                    color="orange"
                    closable
                    onClose={() => clearFilter('contact_method')}
                    className="py-1 px-3 text-sm"
                >
                    Contact: {filters.contact_method}
                </Tag>
            )}

            {/* Rating filter */}
            {(filters.rating_min > 0 || filters.rating_max < 5) && (
                <Tag
                    color="gold"
                    closable
                    onClose={() => clearFilter('rating')}
                    className="py-1 px-3 text-sm"
                >
                    Rating: {filters.rating_min} - {filters.rating_max} stars
                </Tag>
            )}

            {/* Clear all button if multiple filters are active */}
            {Object.keys(filters).filter(key =>
                filters[key] &&
                filters[key] !== '' &&
                key !== 'rating_min' &&
                key !== 'rating_max'
            ).length > 1 || ((filters.rating_min > 0 || filters.rating_max < 5) &&
                Object.keys(filters).some(key => filters[key] && filters[key] !== '' && key !== 'rating_min' && key !== 'rating_max')) ? (
                <Tag
                    color="red"
                    closable
                    onClose={() => setFilters({
                        title: '',
                        location: '',
                        type: '',
                        contact_method: '',
                        predefined_location: '',
                        rating_min: 0,
                        rating_max: 5,
                    })}
                    className="py-1 px-3 text-sm font-medium"
                >
                    Clear All Filters
                </Tag>
            ) : null}
        </div>
    );
}
