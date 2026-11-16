export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
]

export const REGION_EXAMPLES: Record<string, string> = {
  Florida: 'e.g. Miami metro, Tampa Bay, Orlando area, Jacksonville',
  Texas: 'e.g. DFW metro, Austin area, Houston metro, San Antonio',
  California: 'e.g. Los Angeles, San Diego, Bay Area, Sacramento',
  'New York': 'e.g. NYC metro, Buffalo, Upstate NY, Long Island',
  Georgia: 'e.g. Atlanta metro, Savannah, Athens, Columbus',
  Colorado: 'e.g. Denver metro, Colorado Springs, Boulder, Fort Collins',
  Arizona: 'e.g. Phoenix metro, Tucson, Scottsdale, Flagstaff',
  Tennessee: 'e.g. Nashville metro, Memphis, Knoxville, Chattanooga',
  'North Carolina': 'e.g. Charlotte metro, Raleigh-Durham, Asheville',
  Washington: 'e.g. Seattle metro, Spokane, Tacoma, Bellevue',
}

export function getRegionPlaceholder(state: string): string {
  return REGION_EXAMPLES[state] ?? 'e.g. metro area, county, or region name'
}
