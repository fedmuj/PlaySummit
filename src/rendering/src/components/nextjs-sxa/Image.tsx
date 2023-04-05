import React from 'react';
import {
  Image as JssImage,
  Link as JssLink,
  ImageField,
  Field,
  LinkField,
  Text,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
  Image: ImageField;
  ImageCaption: Field<string>;
  TargetUrl: LinkField;
}

type ImageProps = {
  params: { [key: string]: string };
  fields: Fields;
};

const ImageDefault = (props: ImageProps): JSX.Element => (
  <div className={`component image ${props.params.styles}`.trimEnd()}>
    <div className="component-content">
      <span className="is-empty-hint">Image</span>
    </div>
  </div>
);

export const Banner = (props: ImageProps): JSX.Element => {
  const backgroundStyle = { backgroundImage: `url('${props?.fields?.Image?.value?.src}')` };

  return (
    <div className={`component hero-banner ${props.params.styles}`}>
      <div className="component-content sc-sxa-image-hero-banner" style={backgroundStyle} />
    </div>
  );
};

export const Default = (props: ImageProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();

  if (props.fields) {
    const Image = () => <JssImage field={props.fields.Image} />;
    const id = props.params.RenderingIdentifier;
    const parsedUrl = new URL(props?.fields?.Image?.value?.src);
    parsedUrl.searchParams.set('t', 'profile');
    const newUrlProfile = parsedUrl.toString();
    parsedUrl.searchParams.set('t', 'medium');
    const newUrlMedium = parsedUrl.toString();
    return (
      <div className={`component image ${props.params.styles}`} id={id ? id : undefined}>
        <div className="component-content">
          {sitecoreContext.pageState === 'edit' ? (
            <Image />
          ) : (
            <JssLink field={props.fields.TargetUrl}>
              <picture>
                <source
                  srcSet={`${newUrlProfile}`}
                  media="(max-width: 40em)"
                  title="MSC Bellissima Public Area Galleria Meraviglia 02"
                />
                <source
                  srcSet={newUrlMedium}
                  media="(max-width: 60em)"
                  title="MSC Bellissima Public Area Galleria Meraviglia 02"
                />
                <Image />
              </picture>
            </JssLink>
          )}
          <Text
            tag="span"
            className="image-caption field-imagecaption"
            field={props.fields.ImageCaption}
          />
        </div>
      </div>
    );
  }

  return <ImageDefault {...props} />;
};
