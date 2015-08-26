
require 'unicode'

module Import
  class Step < Vacuum::Step

    #
    # Connect to the legacy database.
    #
    # @return [Sequel::Database]
    #
    def self.DB

      # Read legacy params from Rails config.
      params = Rails.configuration.database_configuration["legacy"]

      Sequel.connect(
        :adapter => "postgres",
        **params.symbolize_keys
      )

    end

    #
    # Cache a database connection.
    #
    def initialize
      @DB = self.class.DB
      super
    end

    #
    # Parse a mm/dd/yyy date.
    #
    # @param string [String]
    # @return [Date]
    #
    def parse_date(string)
      Date.strptime(string.to_s, '%m/%d/%Y') rescue nil
    end

    #
    # "Empty" strings to nil, flatten Chinese digits.
    #
    # @param value [String]
    # @return [Mixed]
    #
    def clean(value)

      # Empty strings to nil.
      if ['', 'N/A'].include?(value)
        value = nil

      # Normalize Chinese digits.
      elsif value.is_a?(String)
        value = Unicode.normalize_KC(value)
      end

      value

    end

    #
    # Open a shapefile in the /data directory.
    #
    # @param file [String]
    #
    def shapefile(file)

      # Build shapefile path.
      path = "#{Rails.root}/data/#{file}"

      # Yield the RGeo instance.
      RGeo::Shapefile::Reader.open(path) do |shp|
        yield shp
      end

    end

  end
end
