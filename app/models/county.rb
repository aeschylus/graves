# == Schema Information
#
# Table name: counties
#
#  id          :integer          not null, primary key
#  province_id :integer
#  cdc_id      :string
#  name_p      :string
#  name_c      :string
#  geometry    :geometry({:srid= geometry, 0
#

class County < ActiveRecord::Base

  belongs_to :province

  #
  # Match a grave collection with a province.
  #
  # @param c [Collection]
  # @return [Province]
  #
  def self.find_by_collection(c)
    where { ST_Contains(geometry, c.lonlat) }.first
  end

end