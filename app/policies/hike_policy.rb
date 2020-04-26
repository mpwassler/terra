class HikePolicy
  attr_reader :user, :record

  def initialize(user, hike)
    @user = user
    @hike = hike
  end

  def update?
    is_author?
  end

  def edit?
    is_author?
  end

  def destroy?
    is_author?
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.where(user: @user)
    end
  end

  private
    def is_author?
      @user.id == @hike.user_id
    end
end
