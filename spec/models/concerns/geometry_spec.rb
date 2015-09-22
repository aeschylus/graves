
require 'rails_helper'

describe Geometry do

  with_model :GeoModel do

    table do |t|
      t.string :field1
      t.string :field2
      t.string :field3
      t.geometry :geometry, srid: 4326
    end

    model do
      include Geometry
    end

  end

  describe '.to_geojson()' do

    it 'returns the query as GeoJSON' do

      m1 = GeoModel.create!(geometry: Helpers::Geo.point(1, 2))
      m2 = GeoModel.create!(geometry: Helpers::Geo.point(3, 4))
      m3 = GeoModel.create!(geometry: Helpers::Geo.point(5, 6))

      json = GeoModel.to_geojson.deep_symbolize_keys

      expect(json).to include(type: 'FeatureCollection')

      expect(json[:features][0]).to include(
        type: 'Feature',
        id: m1.id,
        geometry: {
          type: 'Point',
          coordinates: [1, 2]
        }
      )

      expect(json[:features][1]).to include(
        type: 'Feature',
        id: m2.id,
        geometry: {
          type: 'Point',
          coordinates: [3, 4]
        }
      )

      expect(json[:features][2]).to include(
        type: 'Feature',
        id: m3.id,
        geometry: {
          type: 'Point',
          coordinates: [5, 6]
        }
      )

    end

    it 'populates `properties` with passed columns'

  end

end
