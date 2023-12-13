import type { Schema, Attribute } from '@strapi/strapi';

export interface LoPointsLearningObjectives extends Schema.Component {
  collectionName: 'components_lo_points_learning_objectives';
  info: {
    displayName: 'Learning Objectives';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    point: Attribute.String;
  };
}

export interface PackagePackages extends Schema.Component {
  collectionName: 'components_package_packages';
  info: {
    displayName: 'packages';
    icon: 'bulletList';
  };
  attributes: {
    packageName: Attribute.String;
  };
}

export interface PointsPackagePoints extends Schema.Component {
  collectionName: 'components_points_package_points';
  info: {
    displayName: 'packagePoints';
    icon: 'bulletList';
  };
  attributes: {
    point: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

export interface ProductProducts extends Schema.Component {
  collectionName: 'components_product_products';
  info: {
    displayName: 'products';
    icon: 'cog';
    description: '';
  };
  attributes: {
    course: Attribute.Relation<
      'product.products',
      'oneToOne',
      'api::course.course'
    >;
    package: Attribute.Relation<
      'product.products',
      'oneToOne',
      'api::package.package'
    >;
  };
}

declare module '@strapi/strapi' {
  export module Shared {
    export interface Components {
      'lo-points.learning-objectives': LoPointsLearningObjectives;
      'package.packages': PackagePackages;
      'points.package-points': PointsPackagePoints;
      'product.products': ProductProducts;
    }
  }
}
