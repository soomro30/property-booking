import { supabase } from '../../supabaseClient';

export const fetchUnits = async () => {
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .order('unit_number', { ascending: true });
  
  if (error) throw new Error('Error fetching units: ' + error.message);
  return data || [];
};

export const fetchRelatedData = async () => {
  const fetchData = async (table) => {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw new Error(`Error fetching ${table}: ${error.message}`);
    return data || [];
  };

  const [floors, properties, unitTypes, bedrooms] = await Promise.all([
    fetchData('floors'),
    fetchData('properties'),
    fetchData('unit_types'),
    fetchData('bedrooms')
  ]);

  return {
    floors: Object.fromEntries(floors.map(f => [f.id, f])),
    properties: Object.fromEntries(properties.map(p => [p.id, p])),
    unitTypes: Object.fromEntries(unitTypes.map(ut => [ut.id, ut])),
    bedrooms: Object.fromEntries(bedrooms.map(b => [b.id, b]))
  };
};

export const createUnit = async (unitData) => {
  const { data, error } = await supabase
    .from('units')
    .insert([unitData]);

  if (error) throw new Error('Error creating unit: ' + error.message);
  return data;
};

export const updateUnit = async (id, unitData) => {
  const { data, error } = await supabase
    .from('units')
    .update(unitData)
    .eq('id', id);

  if (error) throw new Error('Error updating unit: ' + error.message);
  return data;
};

export const deleteUnit = async (id) => {
  const { error } = await supabase
    .from('units')
    .delete()
    .eq('id', id);

  if (error) throw new Error('Error deleting unit: ' + error.message);
};

export const getPropertyIdByName = async (name) => {
  const { data, error } = await supabase
    .from('properties')
    .select('id')
    .eq('name', name)
    .single();

  if (error) throw new Error(`Property not found: ${name}`);
  return data.id;
};

export const getFloorIdByNumber = async (number, propertyId) => {
  const { data, error } = await supabase
    .from('floors')
    .select('id')
    .eq('floor_number', number)
    .eq('property_id', propertyId)
    .single();

  if (data) return data.id;

  const { data: newFloor, error: insertError } = await supabase
    .from('floors')
    .insert({ floor_number: number, property_id: propertyId })
    .select('id')
    .single();

  if (insertError) throw new Error(`Error creating floor: ${insertError.message}`);
  return newFloor.id;
};

export const getUnitTypeIdByName = async (name) => {
  const { data, error } = await supabase
    .from('unit_types')
    .select('id')
    .eq('name', name)
    .single();

  if (error) throw new Error(`Unit type not found: ${name}`);
  return data.id;
};

export const getBedroomIdByNumber = async (number) => {
  const { data, error } = await supabase
    .from('bedrooms')
    .select('id')
    .eq('number_of_bedrooms', number)
    .single();

  if (data) return data.id;

  const { data: newBedroom, error: insertError } = await supabase
    .from('bedrooms')
    .insert({ number_of_bedrooms: number })
    .select('id')
    .single();

  if (insertError) throw new Error(`Error creating bedroom: ${insertError.message}`);
  return newBedroom.id;
};