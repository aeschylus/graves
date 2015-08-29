# == Schema Information
#
# Table name: collections
#
#  id          :integer          not null, primary key
#  num_graves  :integer
#  location    :string
#  destination :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  province_p  :string
#  province_c  :string
#  prefect_p   :string
#  prefect_c   :string
#  county_p    :string
#  county_c    :string
#  town_p      :string
#  town_c      :string
#  village_p   :string
#  village_c   :string
#  notice_id   :integer          not null
#  lonlat      :geometry({:srid= point, 0
#  place_id    :integer
#

class Collection < ActiveRecord::Base

  belongs_to :notice
  belongs_to :place

  validates :notice, presence: true

  #
  # Map geocoding results into the PostGIS point column.
  #
  geocoded_by :address_c do |event, results|
    if geo = results.first
      event.lonlat = Helpers::Geo.point(geo.longitude, geo.latitude)
    end
  end

  #
  # Geocode all collections.
  #
  # @param delay [Float]
  #
  def self.geocode(delay=0.25)

    bar = ProgressBar.new(all.count)

    all.each do |c|

      # Geocode.
      c.geocode
      c.save
      bar.increment!

      # Throttle.
      sleep(delay)

    end

  end

  #
  # Form a Chinese geocoding query.
  #
  def address_c
    [province_c, county_c, town_c].join(',')
  end

  #
  # Form a Pinyin geocoding query.
  #
  def address_p
    [province_p, county_p, town_p, 'China'].join(',')
  end

  #
  # Try to link the collection with a CDC division.
  #
  def link_with_place

    # TODO|dev

    if province_p and county_p and town_p

      self.place = Place
        .by_type('TOWN')
        .select { ['places.*', ST_Distance(geometry, my{lonlat}).as(dist)] }
        .order('dist')
        .limit(1)
        .first

    elsif province_p and county_p

      self.place = Place
        .by_type('COUNTY')
        .where { ST_Contains(geometry, my{lonlat}) }
        .first

    elsif province_p

      self.place = Place
        .by_type('PROVINCE')
        .where { ST_Contains(geometry, my{lonlat}) }
        .first

    end

  end

end
