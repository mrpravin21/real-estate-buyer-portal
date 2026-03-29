
alter table properties add column if not exists area_sqft integer;
alter table properties add column if not exists bedrooms integer;
alter table properties add column if not exists bathrooms integer;
alter table properties add column if not exists parking_spots integer;
alter table properties add column if not exists floors integer;
alter table properties add column if not exists distance_mart_m integer;
alter table properties add column if not exists distance_hospital_m integer;
alter table properties add column if not exists facing varchar(64);
alter table properties add column if not exists year_built integer;

update properties set
  area_sqft = 2100,
  bedrooms = 3,
  bathrooms = 2,
  parking_spots = 1,
  floors = 2,
  distance_mart_m = 420,
  distance_hospital_m = 890,
  facing = 'East',
  year_built = 2018
where title = 'Patan Heritage Terrace';

update properties set
  area_sqft = 1850,
  bedrooms = 2,
  bathrooms = 2,
  parking_spots = 1,
  floors = 1,
  distance_mart_m = 280,
  distance_hospital_m = 1200,
  facing = 'North-East',
  year_built = 2021
where title = 'Boudha Skyline Loft';

update properties set
  area_sqft = 3400,
  bedrooms = 4,
  bathrooms = 3,
  parking_spots = 2,
  floors = 3,
  distance_mart_m = 650,
  distance_hospital_m = 2100,
  facing = 'South',
  year_built = 2016
where title = 'Jhamsikhel Garden Villa';

update properties set
  area_sqft = 1420,
  bedrooms = 2,
  bathrooms = 2,
  parking_spots = 1,
  floors = 1,
  distance_mart_m = 150,
  distance_hospital_m = 950,
  facing = 'West',
  year_built = 2019
where title = 'Thamel Executive Flat';

update properties set
  area_sqft = 2280,
  bedrooms = 3,
  bathrooms = 2,
  parking_spots = 2,
  floors = 2,
  distance_mart_m = 780,
  distance_hospital_m = 1750,
  facing = 'North',
  year_built = 2020
where title = 'Nakkhu Hillside Retreat';
