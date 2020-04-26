Rails.application.routes.draw do
  devise_for :users
  resources :hike_annotations do
  	post 'images', to: 'hike_annotations#add_images'
  end
  resources :hikes
  resources :search, :controller => :search

  root :to => 'search#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
