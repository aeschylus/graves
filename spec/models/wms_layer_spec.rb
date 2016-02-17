# == Schema Information
#
# Table name: wms_layers
#
#  id         :integer          not null, primary key
#  address    :string           not null
#  layer      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

describe WmsLayer, type: :model do

  describe 'columns' do
    it { should have_db_column(:address).with_options(null: false) }
    it { should have_db_column(:layer).with_options(null: false) }
  end

  describe 'validations' do
    it { should validate_presence_of(:address) }
    it { should validate_presence_of(:layer) }
  end

end
