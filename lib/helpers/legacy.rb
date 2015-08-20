
module Helpers::Legacy

  #
  # Connect to the legacy database.
  #
  # returns [Sequel::Database]
  #
  def self.DB

    # Read legacy params from Rails config.
    params = Rails.configuration.database_configuration["legacy"]

    Sequel.connect(
      :adapter => "postgres",
      **params.symbolize_keys
    )

  end

end