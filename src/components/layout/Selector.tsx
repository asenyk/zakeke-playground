
import { ReactComponent as AngleRightSolid } from '../../assets/icons/angle-right-solid.svg';
import { ReactComponent as AngleLeftSolid } from '../../assets/icons/angle-left-solid.svg';

import OptionItem from '../widgets/Option';
import Designer from './Designer';
import star from '../../assets/icons/star.svg';

import { CarouselContainer, Icon } from 'components/Atomic';
import { useState, useEffect } from 'react';
import { useZakeke } from 'zakeke-configurator-react';
import { SelectorContainer, GroupsContainer, Template, GroupItem, GroupIcon, AttributesContainer, AttributeItem, AttributeName, OptionSelectedName, OptionsContainer, TemplatesContainer } from './SelectorStyled';
import { getDefinitiveGroups } from 'Helpers';

const Selector = () => {
    const { isSceneLoading, isAreaVisible, groups, product, templates, currentTemplate, setCamera, setTemplate } = useZakeke();

    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [selectedAttributeId, setSelectedAttributeId] = useState<number | null>(null);
    const [selectedCarouselSlide, setSelectedCarouselSlide] = useState<number>(0);

    const shouldCustomizerGroupBeVisible = !isSceneLoading && product ? product.areas.some(area => isAreaVisible(area.id)) : false;
    const actualGroups = getDefinitiveGroups(groups, shouldCustomizerGroupBeVisible) ?? [];

    const selectedGroup = selectedGroupId ? actualGroups.find(group => group.id === selectedGroupId) : null;
    const selectedAttribute = selectedGroup?.attributes.find(attr => attr.id === selectedAttributeId);

    // Initial template selection
    useEffect(() => {
        if (templates.length > 0 && !currentTemplate)
            setTemplate(templates[0].id);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templates]);

    // Initial group selection
    useEffect(() => {
        if (!isSceneLoading && actualGroups.length > 0 && !selectedGroupId) {
            setSelectedGroupId(actualGroups[0].id);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSceneLoading, actualGroups]);

    // Reset attribute selection when group selection changes
    useEffect(() => {
        if (selectedGroup && selectedGroup.id !== -2) {
            setSelectedAttributeId(selectedGroup.attributes[0].id);
            setSelectedCarouselSlide(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedGroupId]);

    // Camera
    useEffect(() => {
        if (!isSceneLoading && selectedGroup && selectedGroup.cameraLocationId) {
            setCamera(selectedGroup.cameraLocationId);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedGroupId, isSceneLoading]);

    return <SelectorContainer>
        <GroupsContainer>
            {actualGroups.map(group => {
                if (group)
                    return <GroupItem
                        key={group.guid}
                        className={'group-item' + (group.id === selectedGroupId ? ' selected' : '')}
                        onClick={() => setSelectedGroupId(group.id)}
                    >
                        <GroupIcon src={group.imageUrl  && group.imageUrl !== "" && group.id > 0 ? group.imageUrl : star} />
                        <span>{group.name}</span>
                    </GroupItem>
                else
                    return null;
            })}
        </GroupsContainer>

        <AttributesContainer >
            {selectedGroupId && selectedGroupId === -2 && templates.length > 1 &&
                <TemplatesContainer>
                    {templates.map(template => <Template
                        key={template.id}
                        selected={currentTemplate === template}
                        onClick={() => {
                            setTemplate(template.id);
                        }}
                    >
                        {template.name}
                    </Template>)}
                </TemplatesContainer>}

            {selectedGroupId !== -2 && <>

                {/* Attributes */}
                <CarouselContainer key={selectedGroupId} slidesToShow={window.innerWidth <= 1600 ? 3 : 4} slideIndex={selectedCarouselSlide} afterSlide={setSelectedCarouselSlide}
                    slidesToScroll={1}
                    speed={50}
                    renderBottomCenterControls={() => <span />}

                    renderCenterRightControls={({ nextSlide, currentSlide, slideCount }) =>
                        (currentSlide + (window.innerWidth <= 1600 ? 3 : 4) > slideCount - 1 ? null : <Icon><AngleRightSolid /></Icon>)}

                    renderCenterLeftControls={({ previousSlide, currentSlide, slideCount }) =>
                        (currentSlide === 0 ? null : <Icon><AngleLeftSolid /></Icon>)}>

                    {actualGroups.find(group => group.id === selectedGroupId)?.attributes.map(attribute => {
                        return <AttributeItem key={attribute.guid} onClick={() => setSelectedAttributeId(attribute.id)}>
                            <AttributeName > {attribute.name.toUpperCase()} </AttributeName>
                            <OptionSelectedName>{attribute.options.find(opt => opt.selected)?.name ?? ""}</OptionSelectedName>
                        </AttributeItem>
                    })}
                </CarouselContainer>

                {/* Options */}
                <OptionsContainer >
                    {selectedAttribute && selectedAttribute.options.map(option => option.enabled && <OptionItem key={option.guid} option={option} />)}
                </OptionsContainer>
            </>
            }

            {/* Designer / Customizer */}
            {selectedGroupId === -2 && <Designer />}

        </AttributesContainer>
    </SelectorContainer>
}

export default Selector;